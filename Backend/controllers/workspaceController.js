const pool = require("../config/db");

exports.createWorkspace = async (req, res) => {
  const userId = req.user.userId;
  const { organizationId, name, description } = req.body;

  try {
    // Check if the user belongs to the organization
    const orgCheck = await pool.query(
      "SELECT * FROM user_organizations WHERE user_id = $1 AND organization_id = $2",
      [userId, organizationId]
    );

    if (orgCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not belong to this organization" });
    }

    // **Start a transaction**
    await pool.query("BEGIN");

    // Insert new workspace
    const workspaceResult = await pool.query(
      "INSERT INTO workspaces (name, description, organization_id, creator_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description || null, organizationId, userId]
    );

    const workspace = workspaceResult.rows[0];

    // **Create default Activity App in the new workspace**
    const appResult = await pool.query(
      "INSERT INTO apps (name, workspace_id, creator_id) VALUES ($1, $2, $3) RETURNING id",
      ["Activity", workspace.id, userId]
    );

    const appId = appResult.rows[0].id;

    // **Define fields for the Activity App**
    const activityAppFields = [
      { name: "Title", field_type: "text", is_required: true },
      { name: "Content", field_type: "text", is_required: false },
      { name: "Image", field_type: "file", is_required: false },
      { name: "Author", field_type: "user", is_required: true },
      { name: "Timestamp", field_type: "datetime", is_required: true },
    ];

    // **Insert fields into app_fields table**
    for (const field of activityAppFields) {
      await pool.query(
        "INSERT INTO app_fields (app_id, name, field_type, is_required) VALUES ($1, $2, $3, $4)",
        [appId, field.name, field.field_type, field.is_required]
      );
    }

    // **Commit the transaction**
    await pool.query("COMMIT");

    res
      .status(201)
      .json({ message: "Workspace created successfully", workspace });
  } catch (error) {
    // **Rollback the transaction in case of error**
    await pool.query("ROLLBACK");
    console.error("Error creating workspace:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkspaceDetails = async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId } = req.params;

  try {
    // Check if the user has access to the workspace
    const workspaceResult = await pool.query(
      `SELECT w.id, w.name, w.description
             FROM workspaces w
             INNER JOIN organizations o ON w.organization_id = o.id
             INNER JOIN user_organizations uo ON o.id = uo.organization_id
             WHERE w.id = $1 AND uo.user_id = $2`,
      [workspaceId, userId]
    );

    if (workspaceResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this workspace" });
    }

    const workspace = workspaceResult.rows[0];

    // Fetch apps within the workspace
    const appsResult = await pool.query(
      "SELECT id, name FROM apps WHERE workspace_id = $1",
      [workspaceId]
    );

    const apps = appsResult.rows;

    res.status(200).json({ workspace, apps });
  } catch (error) {
    console.error("Error fetching workspace details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
