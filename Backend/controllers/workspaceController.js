const pool = require('../config/db');

exports.createWorkspace = async (req, res) => {
    const userId = req.user.userId;
    const { organizationId, name, description } = req.body;

    try {
        // Check if the user belongs to the organization
        const orgCheck = await pool.query(
            'SELECT * FROM user_organizations WHERE user_id = $1 AND organization_id = $2',
            [userId, organizationId]
        );

        if (orgCheck.rows.length === 0) {
            return res.status(403).json({ message: 'You do not belong to this organization' });
        }

        // Insert new workspace
        const result = await pool.query(
            'INSERT INTO workspaces (name, description, organization_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description || null, organizationId, userId]
        );

        const workspace = result.rows[0];

        res.status(201).json({ message: 'Workspace created successfully', workspace });
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
