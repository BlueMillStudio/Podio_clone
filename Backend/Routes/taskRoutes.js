const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/tasks", (req, res) => {
  const { title, description, dueDate, dueTime, assignee, attachmentName } =
    req.body;

  const sql = `INSERT INTO tasks (title, description, due_date, due_time, assignee, attachment_name) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [title, description, dueDate, dueTime, assignee, attachmentName],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        title,
        description,
        dueDate,
        dueTime,
        assignee,
        attachmentName,
      });
    }
  );
});

router.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
