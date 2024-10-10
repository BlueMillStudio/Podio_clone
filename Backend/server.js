// server.js

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const taskRoutes = require("./Routes/taskRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", taskRoutes);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// User registration
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
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
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }
});

// User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
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

// server.js (add this route)

app.post("/api/complete-profile", authenticateToken, async (req, res) => {
  const { companyName, industry, useCase, organizationSize, phoneNumber } =
    req.body;
  const userId = req.user.userId;

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Update user profile
    await pool.query("UPDATE users SET phone_number = $1 WHERE id = $2", [
      phoneNumber,
      userId,
    ]);

    // Create organization
    const orgResult = await pool.query(
      "INSERT INTO organizations (name, industry, size, created_by) VALUES ($1, $2, $3, $4) RETURNING id",
      [companyName, industry, organizationSize, userId]
    );
    const orgId = orgResult.rows[0].id;

    // Create default workspace (e.g., "Employee Network")
    await pool.query(
      "INSERT INTO workspaces (name, organization_id, created_by) VALUES ($1, $2, $3)",
      ["Employee Network", orgId, userId]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({
      message: "Profile completed and organization created successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error in profile completion:", error);
    res
      .status(500)
      .json({ message: "Error completing profile", error: error.message });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
