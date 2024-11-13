const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all employees
router.get('/', (req, res) => {
    db.query('SELECT * FROM employees', (error, results) => {
        if (error) throw error;
        res.render('employees', { employees: results });
    });
});

// Add new employee
router.post('/add', (req, res) => {
    const { name, salary, sector } = req.body;
    db.query('INSERT INTO employees (name, salary, sector) VALUES (?, ?, ?)', 
        [name, salary, sector], 
        (error) => {
            if (error) throw error;
            res.redirect('/employees');
        });
});

module.exports = router;
