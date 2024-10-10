// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists and is verified
        const result = await pool.query('SELECT is_verified FROM users WHERE id = $1', [decoded.userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Email not verified' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(403).json({ message: 'Invalid token' });
    }
};
