const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs'); // Only if providing CA certificate
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        client.query('SELECT NOW()', (err, result) => {
            release();
            if (err) {
                console.error('Error executing query', err.stack);
            } else {
                console.log('Connected to Database:', result.rows[0]);
            }
        });
    }
});

// User registration
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log('Attempting to register user:', { username, email });
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        console.log('User registered successfully:', result.rows[0]);
        res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
    } catch (error) {
        console.error('Error in user registration:', error);
        if (error.code === '23505') { // Unique violation error code
            res.status(400).json({ message: 'Username or email already exists' });
        } else {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: 'Login successful', token });
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
