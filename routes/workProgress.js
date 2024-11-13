const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all work progress
router.get('/', (req, res) => {
    db.query('SELECT * FROM work_progress', (error, results) => {
        if (error) throw error;
        res.render('work-progress', { workProgress: results });
    });
});

// Add new work progress
router.post('/add', (req, res) => {
    const { job_name, staff_id } = req.body;
    db.query('INSERT INTO work_progress (job_name, staff_id) VALUES (?, ?)', 
        [job_name, staff_id], 
        (error) => {
            if (error) throw error;
            res.redirect('/work-progress');
        });
});

module.exports = router;