// backend/controllers/profileController.js

const pool = require('../config/db');

exports.completeProfile = async (req, res) => {
    const { companyName, industry, useCase, organizationSize, phoneNumber } = req.body;
    const userId = req.user.userId;

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Update user profile
        await pool.query(
            'UPDATE users SET phone_number = $1 WHERE id = $2',
            [phoneNumber, userId]
        );

        // Create organization
        const orgResult = await pool.query(
            'INSERT INTO organizations (name, industry, size, created_by) VALUES ($1, $2, $3, $4) RETURNING id',
            [companyName, industry, organizationSize, userId]
        );
        const orgId = orgResult.rows[0].id;

        // Create default workspace
        await pool.query(
            'INSERT INTO workspaces (name, organization_id, created_by) VALUES ($1, $2, $3)',
            ['Employee Network', orgId, userId]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(200).json({ message: 'Profile completed and organization created successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error in profile completion:', error);
        res.status(500).json({ message: 'Error completing profile', error: error.message });
    }
};
