const inquirer = require ('inquirer');
const Sales = require('./lib/sales');
const Engineering = require('./lib/engineering');
const Finance = require('./lib/finance');
const Legal = require('./lib/legal')
const mysql = require('mysql2')
const cTable = require('console.table')

const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: process.env[''],
        database: 'team_db'
    },
    console.log('Connected to the team_db databases.') 
)

const departments = [] //to store department
const roles = [] // to store role
const managers = [] // to store manager
const employees = [] // to store employees 

class Team {
    constructor(){
        this.team = [] //to store the user input
    }

    askUserInput(){
        return inquirer
            .prompt([
                {
                    type:'choice',
                    name:'selectUserInput',
                    message:'WWhat would you like to do?',
                    choices: ['View All Department','View All Roles','View All Employees','Add Department','Add Role', 'Add Employee','Update Employee Role','Quit']
                },
            ])
            .then(({selectUserInput})=>{
                if(selectUserInput === 'View All Department'){
                    this.viewAllDepartment();
                }else if(selectUserInput === 'View All Roles'){
                    this.viewAllRoles();
                }else if(selectUserInput === 'View All Employees'){
                    this.viewAllEmployees();
                }else if(selectUserInput === 'Add Department'){
                    this.addDepartment();
                }else if(selectUserInput === 'Add Role'){
                    this.addRole();
                }else if(selectUserInput === 'Add Employee'){
                    this.addEmployee();
                }else if(selectUserInput === 'Update Employee Role'){
                    this.updateEmployeeRole();
                }else if(selectUserInput === 'Quit'){
                    console.log(this.team)
                    this.quit();
                }
            })

    }

    viewAllDepartment(){
        db.query('SELECT * FROM departments', function(error, results){
            if (error) throw error;
            console.table([
                {
                    department_id: ;
                    name: ; 
                }
            ])
        })
    };

    viewAllRoles(){
        db.query('SELECT * FROM roles', function(error, results){
            if (error) throw error;
            console.table([
                {
                    role_id: ;
                    title: ;
                    department: ;
                    salary: ;
                }
            ])
        })
    };

    viewAllEmployees(){
        db.query('SELECT * FROM employees', function(error, results){
            if (error) throw error;
            console.table([
                {
                    employee_id: ;
                    first_name: ;
                    last_name: ;
                    title: ;
                    department: ;
                    salary: ;
                    manager: ;
                }
            ])
        })
    };

    addDepartment(){
        return inquirer
            .prompt ([
                {
                    type: 'input',
                    name: 'newDepartment',
                    message: 'What is the name of the department?'
                }
            ])
            .then(({newDepartment})=>{
                departments.push(newDepartment);
                this.viewAllDepartment();
            })

    };

    addRole(){
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
            .then(({newRole, newSalary, selectDepartment})=>{
                roles.push(newRole)
                console.log(roles)
                this.viewAllRoles();
            })
    };

    addEmployee(){
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
            .then(({newFirstName, newLastName, selectRole, selectManager})=>{
                manager.push(selectManager)
                this.viewAllEmployees();
            })
    };

    updateEmployeeRole(){
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
            .then(({selectEmployee, selectRole})=>{
                console.log(employees)
                console.log(roles)
                this.viewAllEmployees()
                console.log("Update employee's role")
            })
    };

    quit();

}

const team = new Team()
team.askUserInput() //start the questions 