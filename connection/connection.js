const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env[''],
        database: 'team_db'
    },
    console.log('Connected to the team_db database.')
);

module.exports = {connection};