const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/auth");

router.get("/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get tasks for logged in user
router.get("/tasks/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.due_date,
        t.due_time,
        t.status,
        t.assignee_id,
        t.attachment_name,
        t.labels,
        t.creator_id,
        t.created_at
        
      FROM tasks t
      LEFT JOIN users u ON t.creator_id = u.id
      WHERE t.creator_id = $1 
      OR t.assignee_id = $1
      ORDER BY t.due_date ASC, t.due_time ASC
    `;

    const result = await db.query(query, [userId]);

    // Format dates and times for frontend
    const formattedTasks = result.rows.map((task) => ({
      ...task,
      due_date: task.due_date
        ? new Date(task.due_date).toISOString().split("T")[0]
        : null,
      due_time: task.due_time || null,
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
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
    attachment_name,
    labels,
    creator_id,
  } = req.body;

  const sql = `
    INSERT INTO tasks (
      title, description, due_date, due_time, status, 
      assignee_id, attachment_name, labels, creator_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *
  `;

  try {
    console.log("Received task data:", req.body);
    const result = await db.query(sql, [
      title,
      description,
      due_date,
      due_time,
      status || "pending",
      assignee_id,
      attachment_name,
      labels,
      creator_id,
    ]);
    console.log("Task created:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update task status
router.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = `
    UPDATE tasks
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;

  try {
    const result = await db.query(sql, [status, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
