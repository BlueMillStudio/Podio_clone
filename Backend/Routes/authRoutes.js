// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
            [username, email, hashedPassword]
        );

        const userId = result.rows[0].id;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.error("Error in user registration:", error);
        if (error.code === "23505") {
            res.status(400).json({ message: "Username or email already exists" });
        } else {
            res.status(500).json({ message: "Error creating user", error: error.message });
        }
    }
});

// User login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
                res.json({ message: "Login successful", token });
            } else {
                res.status(400).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

module.exports = router;