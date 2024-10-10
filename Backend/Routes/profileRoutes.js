// profileRoutes.js
const express = require('express');
const db = require('./db');
const { authenticateToken } = require('./middleware');

const router = express.Router();

router.post("/complete-profile", authenticateToken, async (req, res) => {
    const { companyName, industry, useCase, organizationSize, phoneNumber } = req.body;
    const userId = req.user.userId;

    try {
        // Start a transaction
        await db.query("BEGIN");

        // Update user profile
        await db.query("UPDATE users SET phone_number = $1 WHERE id = $2", [
            phoneNumber,
            userId,
        ]);

        // Create organization
        const orgResult = await db.query(
            "INSERT INTO organizations (name, industry, size, created_by) VALUES ($1, $2, $3, $4) RETURNING id",
            [companyName, industry, organizationSize, userId]
        );
        const orgId = orgResult.rows[0].id;

        // Create default workspace (e.g., "Employee Network")
        await db.query(
            "INSERT INTO workspaces (name, organization_id, created_by) VALUES ($1, $2, $3)",
            ["Employee Network", orgId, userId]
        );

        // Commit the transaction
        await db.query("COMMIT");

        res.status(200).json({
            message: "Profile completed and organization created successfully",
        });
    } catch (error) {
        await db.query("ROLLBACK");
        console.error("Error in profile completion:", error);
        res.status(500).json({ message: "Error completing profile", error: error.message });
    }
});

module.exports = router;