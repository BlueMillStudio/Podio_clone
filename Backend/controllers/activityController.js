const pool = require("../config/db");

exports.getActivityPosts = async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId } = req.params;

  try {
    // Verify user has access to the workspace
    const accessCheck = await pool.query(
      `SELECT w.id
       FROM workspaces w
       INNER JOIN organizations o ON w.organization_id = o.id
       INNER JOIN user_organizations uo ON o.id = uo.organization_id
       WHERE w.id = $1 AND uo.user_id = $2`,
      [workspaceId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Access denied to this workspace" });
    }

    // Fetch activity posts for the workspace
    const postsResult = await pool.query(
      `SELECT ap.id, ap.content, ap.image_url, ap.created_at, u.id as author_id, u.username as author_name
       FROM activity_posts ap
       INNER JOIN users u ON ap.author_id = u.id
       WHERE ap.workspace_id = $1
       ORDER BY ap.created_at DESC`,
      [workspaceId]
    );

    res.status(200).json({ posts: postsResult.rows });
  } catch (error) {
    console.error("Error fetching activity posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createActivityPost = async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId } = req.params;
  const { content, imageUrl } = req.body;

  try {
    // Verify user has access to the workspace
    const accessCheck = await pool.query(
      `SELECT w.id
       FROM workspaces w
       INNER JOIN organizations o ON w.organization_id = o.id
       INNER JOIN user_organizations uo ON o.id = uo.organization_id
       WHERE w.id = $1 AND uo.user_id = $2`,
      [workspaceId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Access denied to this workspace" });
    }

    // Insert new activity post
    const insertResult = await pool.query(
      `INSERT INTO activity_posts (workspace_id, author_id, content, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, content, image_url, created_at`,
      [workspaceId, userId, content, imageUrl || null]
    );

    const newPost = insertResult.rows[0];

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating activity post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkspaceTasks = async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId } = req.params;

  try {
    // Verify user has access to the workspace
    const accessCheck = await pool.query(
      `SELECT w.id
       FROM workspaces w
       INNER JOIN organizations o ON w.organization_id = o.id
       INNER JOIN user_organizations uo ON o.id = uo.organization_id
       WHERE w.id = $1 AND uo.user_id = $2`,
      [workspaceId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Access denied to this workspace" });
    }

    // Fetch tasks for the workspace
    const tasksResult = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.due_date, t.due_time, t.created_at,
              u.id as assignee_id_id, u.username as assignee_id_name
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.workspace_id = $1
       ORDER BY t.created_at DESC`,
      [workspaceId]
    );

    res.status(200).json({ tasks: tasksResult.rows });
  } catch (error) {
    console.error("Error fetching workspace tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTask = async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId } = req.params;
  const { title, description, dueDate, dueTime, assignedTo } = req.body;

  try {
    // Verify user has access to the workspace
    const accessCheck = await pool.query(
      `SELECT w.id
       FROM workspaces w
       INNER JOIN organizations o ON w.organization_id = o.id
       INNER JOIN user_organizations uo ON o.id = uo.organization_id
       WHERE w.id = $1 AND uo.user_id = $2`,
      [workspaceId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Access denied to this workspace" });
    }

    // Insert new task
    const insertResult = await pool.query(
      `INSERT INTO tasks (workspace_id, created_by, assignee_id, title, description, due_date, due_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, status, due_date, due_time, created_at`,
      [
        workspaceId,
        userId,
        assignedTo || null,
        title,
        description || null,
        dueDate || null,
        dueTime || null,
      ]
    );

    const newTask = insertResult.rows[0];

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};
