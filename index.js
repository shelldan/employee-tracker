const cTable = require('console.table')
const inquirer = require('inquirer')
const {connection} = require('./connection/connection.js')

// const departments = [] //to store department
// const roles = [] //to store role
// const employees = [] //to store employees 
// const manager = [] //to store manager

askUserInput = () =>{
    return inquirer
        .prompt([
            {
                type:'list',
                name:'selectUserInput',
                message:'What would you like to do?',
                choices: ['View All Departments','View All Roles','View All Employees','Add Department','Add Role', 'Add Employee','Update Employee Role','Quit']
            }
        ])
        .then(({selectUserInput})=>{
            if(selectUserInput === 'View All Departments'){
                viewAllDepartments();
                askUserInput();
            }else if(selectUserInput === 'View All Roles'){
                viewAllRoles();
                askUserInput();
            }else if(selectUserInput === 'View All Employees'){
                viewAllEmployees();
                askUserInput();
            }else if(selectUserInput === 'Add Department'){
                addDepartment();
            }else if(selectUserInput === 'Add Role'){
                addRole();
            }else if(selectUserInput === 'Add Employee'){
                addEmployee();
            }else if(selectUserInput === 'Update Employee Role'){
                updateEmployeeRole();
            }else if(selectUserInput === 'Quit'){
                console.log(team)
                quit();
            }
        })
}

viewAllDepartments = () =>{
    let query = `SELECT * FROM departments`
    connection.query(query, (err,result) => {
        if(err){
            console.log(err);
        }

        console.table(result);
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

        console.table(result);
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

        console.table(result);
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
                console.log(result)
                viewAllDepartments();
            })

            askUserInput();
        })
}


addRole = ()=>{
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
                type: 'List',
                name: 'selectDepartment',
                message: 'Which department does the role belong to?',
                choices: departments
            }
        ])
        .then((answer)=>{
            let query = ``;
            let newRole = {answer.newRole, answer.newSalary, answer.selectDepartment}
            connection.query(query, newRole, (err, result) =>{
                if(err){
                    console.log(err);
                }
                console.log(result)
                viewAllRoles();
            })

            askUserInput();
        })
}



addEmployee = () =>{

}


askUserInput()//start 