const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '@Agutu34904788', // replace with your MySQL password
    database: 'construction_management' // your database name
});

db.connect((err) => {
    if (err) {
        console.error('Could not connect to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;
