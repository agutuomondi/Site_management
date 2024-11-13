const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all materials
router.get('/', (req, res) => {
    db.query('SELECT * FROM materials', (error, results) => {
        if (error) throw error;
        res.render('materials', { materials: results });
    });
});

// Add new material
router.post('/add', (req, res) => {
    const { name, supplier, delivery_date, quantity } = req.body;
    db.query('INSERT INTO materials (name, supplier, delivery_date, quantity) VALUES (?, ?, ?, ?)', 
        [name, supplier, delivery_date, quantity], 
        (error) => {
            if (error) throw error;
            res.redirect('/materials');
        });
});

// Update material
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { quantity, used_quantity } = req.body;
    db.query('UPDATE materials SET quantity = ?, used_quantity = ? WHERE id = ?', 
        [quantity, used_quantity, id], 
        (error) => {
            if (error) throw error;
            res.redirect('/materials');
        });
});

// Delete material
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM materials WHERE id = ?', [id], (error) => {
        if (error) throw error;
        res.redirect('/materials');
    });
});

module.exports = router;
