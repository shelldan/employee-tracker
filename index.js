const cTable = require('console.table')
const inquirer = require('inquirer')
const {connection} = require('./config/connection.js')

let departmentsArray = [] //to store department
let roles = [] //to store role
let employees = [] //to store employees 
let manager = [] //to store manager

askUserInput = () =>{
    return inquirer
        .prompt([
            {
                type:'rawlist',
                name:'selectUserInput',
                message:'What would you like to do?',
                choices: ['View All Departments','View All Roles','View All Employees','Add Department','Add Role', 'Add Employee','Update Employee Role','Quit']
            }
        ])
        .then(({selectUserInput})=>{
            if(selectUserInput === 'View All Departments'){
                viewAllDepartments();
            }else if(selectUserInput === 'View All Roles'){
                viewAllRoles();
            }else if(selectUserInput === 'View All Employees'){
                viewAllEmployees();
            }else if(selectUserInput === 'Add Department'){
                addDepartment();
            }else if(selectUserInput === 'Add Role'){
                addRole();
            }else if(selectUserInput === 'Add Employee'){
                addEmployee();
            }else if(selectUserInput === 'Update Employee Role'){
                updateEmployeeRole();
            }else if(selectUserInput === 'Quit'){
                connection.end();
            }
        })
}

viewAllDepartments = () =>{
    //console.log('Department Table\n')
    let query = `SELECT * FROM departments`
    connection.query(query, (err,result) => {
        if(err){
            console.log(err);
        }
        console.log(` `);
        console.log(`=================================================================================================`)
        console.log(`                                  All Employees`)
        console.table(result);
        console.log('=================================================================================================')
        console.log(` `)
        askUserInput()
    });

};

viewAllRoles = () => {
    let query = `SELECT role_id, title, department, salary 
                 FROM roles 
                 JOIN departments 
                 ON roles.department_id = departments.department_id`
    
    connection.query(query, (err, result) => {
        if(err){
            console.log(err);
        }

        console.log(` `);
        console.log(`=================================================================================================`)
        console.log(`                                  All Employees`)
        console.table(result);
        console.log('=================================================================================================')
        console.log(` `)
        askUserInput()
    });
};

viewAllEmployees = () => {
    let query = `SELECT employees.employee_id, 
                        employees.first_name, 
                        employees.last_name,
                        roles.title, 
                        departments.department,
                        roles.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employees 
                LEFT JOIN employees manager
                ON manager.employee_id = employees.manager_id
                LEFT JOIN roles
                ON employees.role_id = roles.role_id
                LEFT JOIN departments
                ON roles.department_id = departments.department_id`

    connection.query(query, (err, result) => {
        if(err){
            console.log(err);
        }

        console.log(` `);
        console.log(`=================================================================================================`)
        console.log(`                                  All Employees`)
        console.table(result);
        console.log('=================================================================================================')
        console.log(` `)
        askUserInput()
    });
};

addDepartment = () => {
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What is the name of the department?'
            }
        ])
        .then((answer)=>{
            let query = `INSERT INTO departments (department) VALUES (?)`;
            let newDepartment = answer.newDepartment
            connection.query(query, newDepartment, (err, result) =>{
                if(err){
                    console.log(err);
                }
                viewAllDepartments();
                
            })
        })
}

addRole = () =>{
    connection.query(`SELECT * FROM departments`,(err, res)=>{
        if(err){
            console.log(err);
        }
        console.log(res)
        departmentsArray = res.map(dept => (
            {
                name: dept.department,
                value: dept.department_id
            }

        ))
        console.log(departmentsArray)
        return inquirer
            .prompt ([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'newSalary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'selectDepartment',
                    message: 'Which department does the role belong to?',
                    choices: departmentsArray
                }
            ])
            .then((answer)=>{
                let sql = `INSERT INTO roles (title, department, salary) VALUES (?, ?, ?)`
                let params = [answer.newRole, answer.selectDepartment, answer.newSalary]
                connection.query(sql, params, (err, result) =>{
                    if(err){
                        console.log(err);
                    }
                    viewAllRoles();
                })
            })

    })
}


addEmployee = () =>{
    return inquirer
        .prompt ([
            {
                type: 'input',
                name: 'newFirstName',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'newLastName',
                message: "What is the employee's last name?"
            },
            {
                type: 'list',
                name: 'selectRole',
                message: "What is the employee's role?",
                choices: roles
            },
            {
                type: 'list',
                name: 'selectManager',
                message: "What is the employee's manager?",
                choices: managers
            }
        ])
        .then((answer)=>{
            let query = `INSERT INTO employees (employees.first_name, employees.last_name, roles.title, manager)
                         VALUE (${answer.newFirstName}, ${answer.newLastName}, ${answer.selectRole}, ${answer.selectManager})
                         FROM employees
                         LEFT JOIN employees manager
                         ON manager.employee_id = employees.manager_id
                         LEFT JOIN roles
                         ON employees.role_id = roles.role_id
                         LEFT JOIN departments
                         ON roles.department_id = departments.department_id`;
            // let newEmployee = {
            //     newFirstName: answer.newFirstName, 
            //     newLastName: answer.newLastName, 
            //     selectRole: answer.selectRole, 
            //     selectManager: answer.selectManager
            // }
            connection.query(query, (err, result)=>{
                if(err){
                    console.log(err);
                }
                console.log(result);
                viewAllEmployees()
            })
            
            askUserInput()
        })
}

updateEmployeeRole=()=>{
    return inquirer
        .prompt ([
            {
                type: 'list',
                name: 'selectEmployee',
                message: "Which employee's role do you want to update?",
                choices: employees
            },
            {
                type: 'list',
                name: 'selectRole',
                message: 'Which role do you want to assign the selected employee?',
                choices: roles
            }
        ])
        .then((answer)=>{
            let query = `SELECT
                            ${answer.selectEmployees.firstName}
                            ${answer.selectEmployees.lastName}
                         From 
                            employees
                         WHERE
                            employees.employee_id = ${answer.selectRole}
                         UPDATE employees
                         SET
                            employees.roles = ${answer.selectRole}
                         WHERE 
                            employees.employee_id = ${answer.selectRole}`;

            // let updateEmployee = {
            //     selectEmployee: answer.selectEmployee, 
            //     selectRole: answer.selectRole}
            connection.query(query, (err, result)=>{
                if(err){
                    console.log(err);
                }
                console.log(result);
                viewAllEmployees()
            })
            askUserInput()
        })
}


askUserInput()//start 