const mysql = require('mysql2');
const cTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env[''],
        database: 'team_db'
    },
    console.log('Connected to the team_db database.')
);

db.query('SELECT * FROM departments', (err, result) => {
    if(err){
        console.log(err);
    }
    //console.log(result);
    console.table(result);
});

db.query('SELECT role_id, title, department, salary FROM roles JOIN departments ON roles.department_id = departments.department_id', (err, result) => {
    if(err){
        console.log(err);
    }
    //console.log(result);
    console.table(result)
});

db.query('SELECT employee_id, first_name, last_name, title, department, salary FROM employees JOIN roles ON employees.role_id = roles.role_id JOIN departments ON roles.department_id = departments.department_id', (err, result) => {
    if(err){
        console.log(err);
    }
    //console.log(result);
    console.table(result)
});

