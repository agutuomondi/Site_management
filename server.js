require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Import bcrypt
const path = require('path');

// Only require 'mysql2' once
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'construction_management'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Could not connect to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
app.get('/', (req, res) => {
    res.render('login'); // Render login page
});

app.use('/materials', require('./routes/materials'));
app.use('/payments', require('./routes/payments'));
app.use('/employees', require('./routes/employees'));
app.use('/work-progress', require('./routes/workProgress'));

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            const user = results[0];
            // Compare passwords using bcrypt
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) throw err;
                if (match) {
                    req.session.user = user; // Store user info in session
                    res.redirect('/dashboard'); // Redirect to dashboard
                } else {
                    res.send('Invalid username or password!');
                }
            });
        } else {
            res.send('Invalid username or password!');
        }
    });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }
    res.render('dashboard', { user: req.session.user }); // Pass user info to the dashboard
});

// Registration route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        // Save the new user to the database
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (error) => {
            if (error) {
                return res.send('Error creating user!');
            }
            res.redirect('/'); // Redirect to login page after successful registration
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
