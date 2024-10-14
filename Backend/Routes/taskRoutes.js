const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tasks", async (req, res) => {
  const {
    title,
    description,
    due_date,
    due_time,
    status,
    assignee_id,
    attachment_url,
    attachment_name,
    labels,
  } = req.body;

  const sql = `
    INSERT INTO tasks (
      title, description, due_date, due_time, status, 
      assignee_id, attachment_url, attachment_name, labels
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *
  `;

  try {
    const result = await db.query(sql, [
      title,
      description,
      due_date,
      due_time,
      status || "pending",
      assignee_id,
      attachment_url,
      attachment_name,
      labels,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
