const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/auth");
const { sendInvitationEmail } = require("../services/emailService");

// Create invitation
router.post("/invitations", authenticateToken, async (req, res) => {
  const { organizationId, email, message } = req.body;
  const senderId = req.user.userId; // Change this to match your JWT payload structure

  try {
    // Debug logs
    console.log("Request body:", { organizationId, email, message });
    console.log("Sender ID:", senderId);

    // Convert organizationId to number if it's a string
    const orgId = parseInt(organizationId);

    // Check if user belongs to organization
    const orgCheck = await db.query(
      `
      SELECT uo.*, o.name AS organization_name, o.industry, o.size
      FROM user_organizations uo
      JOIN organizations o ON uo.organization_id = o.id
      WHERE uo.user_id = $1 AND uo.organization_id = $2
    `,
      [senderId, orgId]
    );

    console.log("Organization check result:", orgCheck.rows);

    if (orgCheck.rows.length === 0) {
      return res.status(403).json({
        error: "You do not belong to this organization",
        details: {
          userId: senderId,
          organizationId: orgId,
        },
      });
    }

    const organizationDetails = {
      name: orgCheck.rows[0].organization_name,
      industry: orgCheck.rows[0].industry,
      size: orgCheck.rows[0].size,
    };

    // Generate unique token for invitation
    const token = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Create invitation record
    const result = await db.query(
      `
      INSERT INTO invitations (
        sender_id, 
        recipient_email, 
        organization_id, 
        message, 
        status, 
        token, 
        expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `,
      [senderId, email, orgId, message, "pending", token, expiresAt]
    );

    const invitation = result.rows[0];
    const invitationLink = `${process.env.FRONTEND_URL}/join?token=${token}`;

    // Send invitation email
    await sendInvitationEmail(
      email,
      message,
      invitationLink,
      organizationDetails
    );

    res.status(201).json({
      invitation,
      emailSent: true,
      organizationDetails,
    });
  } catch (error) {
    console.error("Error in invitation creation:", error);
    res.status(500).json({
      error: "Failed to create invitation",
      details: error.message,
    });
  }
});

// Get all invitations for the authenticated user
router.get("/invitations", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT 
        i.*,
        o.name AS organization_name
      FROM invitations i
      JOIN organizations o ON i.organization_id = o.id
      WHERE i.sender_id = $1
      ORDER BY i.created_at DESC
    `,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
});

// Verify invitation token
router.get("/invitations/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    console.log("Verifying token:", token);

    const result = await db.query(
      `
      SELECT 
        i.*,
        o.name as organization_name,
        o.industry,
        o.size
      FROM invitations i
      JOIN organizations o ON i.organization_id = o.id
      WHERE i.token = $1
      AND i.status = 'pending'
      AND i.expires_at > NOW()
    `,
      [token]
    );

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid or expired invitation" });
    }

    const invitation = result.rows[0];

    res.json({
      organization_name: invitation.organization_name,
      organization_details: {
        industry: invitation.industry,
        size: invitation.size,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Failed to verify invitation" });
  }
});

// Accept invitation
router.post("/invitations/accept", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Start transaction
    await db.query("BEGIN");

    // Get invitation details
    const invitationResult = await db.query(
      `
      SELECT 
        i.*,
        o.name as organization_name
      FROM invitations i
      JOIN organizations o ON i.organization_id = o.id
      WHERE i.token = $1
      AND i.status = 'pending'
      AND i.expires_at > NOW()
    `,
      [token]
    );

    if (invitationResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ error: "Invalid or expired invitation" });
    }

    const invitation = invitationResult.rows[0];

    // Get user info
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      invitation.recipient_email,
    ]);

    if (userResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Add user to organization if not already a member
    const orgMemberResult = await db.query(
      `
      INSERT INTO user_organizations (user_id, organization_id, role)
      VALUES ($1, $2, 'member')
      ON CONFLICT (user_id, organization_id) DO NOTHING
      RETURNING id
    `,
      [user.id, invitation.organization_id]
    );

    // Update invitation status
    await db.query(
      `
      UPDATE invitations 
      SET status = 'accepted', 
          accepted_at = NOW()
      WHERE id = $1
    `,
      [invitation.id]
    );

    await db.query("COMMIT");

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        organizationId: invitation.organization_id,
        organizationName: invitation.organization_name,
      },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Accept invitation error:", error);
    res.status(500).json({ error: "Failed to accept invitation" });
  }
});

module.exports = router;
