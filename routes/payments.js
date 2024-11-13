const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all payments
router.get('/', (req, res) => {
    db.query('SELECT * FROM payments', (error, results) => {
        if (error) throw error;
        res.render('payments', { payments: results });
    });
});

// Add new payment
router.post('/add', (req, res) => {
    const { work_done, amount_paid, payment_balance, work_scope } = req.body;
    db.query('INSERT INTO payments (work_done, amount_paid, payment_balance, work_scope) VALUES (?, ?, ?, ?)', 
        [work_done, amount_paid, payment_balance, work_scope], 
        (error) => {
            if (error) throw error;
            res.redirect('/payments');
        });
});

module.exports = router;
