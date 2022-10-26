const cTable = require('console.table')
const inquirer = require('inquirer')
const {connection} = require('./config/connection.js')

let departmentsArray = [] //to store department
let rolesArray = [] //to store role
let employeesArray = [] //to store employees 
let managersArray = [] //to store manager

askUserInput = () =>{
    return inquirer
        .prompt([
            {
                type:'rawlist',
                name:'selectUserInput',
                message:'What would you like to do?',
                choices: ['View All Departments','View All Roles','View All Employees','Add Department','Add Role', 'Add Employee','Update Employee Role', 'Remove employee', 'View department budget', 'Quit']
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
            }else if(selectUserInput === 'View department budget'){
                viewDepartmentBudget();
            }else if(selectUserInput === 'Remove employee'){
                removeEmployee();
            }else if(selectUserInput === 'Quit'){
                connection.end()
            }
        })
}

viewAllDepartments = () =>{
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
            let sql = `INSERT INTO departments (department) VALUES (?)`;
            let params = answer.newDepartment
            connection.query(sql, params, (err, result) =>{
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
        //console.log(res)
        departmentsArray = res.map(dept => (
            {
                name: dept.department,
                value: dept.department_id
            }

        ))
        //console.log(departmentsArray)
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
                let query = `INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)`
                let params = [answer.newRole, answer.selectDepartment, answer.newSalary]
                //console.log(params)
                //console.log(answer.selectDepartment)
                connection.query(query, params, (err, result) =>{
                    if(err){
                        console.log(err);
                    }
                    viewAllRoles();
                })
                
            })

    })
}

addEmployee = () =>{
    connection.query(`SELECT * FROM employees;`,(err, res)=>{
        if(err){
            console.log(err);
        }
        //console.log(res)

        employeesArray = res.map(emp =>(
            {
                name: emp.first_name.concat(' ',emp.last_name),
                value: emp.employee_id
            }
        ))
        
        res.forEach(record =>{
            if(record.manager_id === null){
                managersArray.push ({name: record.first_name.concat(' ', record.last_name), value: record.employee_id})
            }
        })

        connection.query(`SELECT * FROM roles`,(err, res)=>{
            if(err){
                console.log(err)
            }
            rolesArray = res.map(role =>(
                {
                    name: role.title,
                    value: role.role_id,
                }
            ))      
            //console.log(employeesArray)
            //console.log(rolesArray)
            //console.log(managersArray)
        
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
                        choices: rolesArray
                    },
                    {
                        type: 'list',
                        name: 'selectManager',
                        message: "What is the employee's manager?",
                        choices: managersArray
                    }
                ])
                .then((answer)=>{
                    let query = `INSERT INTO employees SET ?`;
                    let params = {
                        first_name: answer.newFirstName,
                        last_name: answer.newLastName,
                        role_id: answer.selectRole,
                        manager_id: answer.selectManager
                    }
                    //console.log(answer)
                    //console.log(params)
                    //console.log(answer.selectRole,answer.selectManager)
                    connection.query(query, params, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        viewAllEmployees()
                    })
                })
        })
    })
}

updateEmployeeRole=()=>{
    connection.query(`SELECT * FROM employees`,(err, res)=>{
        if(err){
            console.log(err);
        }

        //console.log(res)

        employeesArray = res.map(emp =>(
            {
                name: emp.first_name.concat(' ',emp.last_name),
                value: emp.employee_id
            }
        ))

        connection.query('SELECT * FROM roles',(err, res)=>{
            if(err){
                console.log(err)
            }
            rolesArray = res.map(role =>(
                {
                    name: role.title,
                    value: role.role_id,
                }
            ))
            //console.log(employeesArray)     
            //console.log(rolesArray)       
            
            return inquirer
                .prompt ([
                    {
                        type: 'list',
                        name: 'selectEmployee',
                        message: "Which employee's role do you want to update?",
                        choices: employeesArray
                    },
                    {
                        type: 'list',
                        name: 'selectRole',
                        message: 'Which role do you want to assign the selected employee?',
                        choices: rolesArray
                    }
                ])
                .then((answer)=>{
                    let query = `UPDATE employees SET role_id = ${answer.selectRole} WHERE employee_id = ${answer.selectEmployee}`
                    //console.log('I made it here')
                    //console.log(answer)
                    connection.query(query, (err, res)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log(res);
                        viewAllEmployees()
                    })
            })
            
        })
    })
}

removeEmployee =()=>{
    connection.query(`SELECT * FROM employees`,(err, res)=>{
        if(err){
            console.log(err)
        }

        employeesArray = res.map(emp =>(
            {
                name: emp.first_name.concat(' ',emp.last_name),
                value: emp.employee_id
            }
        ))

        return inquirer
            .prompt ([
                {
                    type: 'list',
                    name: 'removeEmployee',
                    message: 'Which employee you want to remove?',
                    choices: employeesArray
                }
            ])
            .then((answer)=>{
                //console.log(answer)
                let sql = `DELETE FROM employees WHERE employee_id = ${answer.removeEmployee}`
                connection.query(sql, (err, res)=>{
                    if(err){
                        console.log(err)
                    }
                    //console.log(res)
                    viewAllEmployees()
                })
            })
    })

}

viewDepartmentBudget=()=>{
    let query =(`SELECT departments.department_id, departments.department, SUM(roles.salary)
                 FROM roles 
                 JOIN departments 
                 ON roles.department_id = departments.department_id
                 GROUP BY roles.department_id`)
    connection.query(query, (err, res)=>{
        if(err){
            console.log(err)
        }

        console.log(` `)
        console.log(`=================================================================================================`)
        console.log(`                                  Budgets`)
        console.table(res)
        console.log('=================================================================================================')
        console.log(` `)
        askUserInput()
    })   
}

askUserInput()//start 