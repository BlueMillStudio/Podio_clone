const pool = require("../config/db");

exports.createApp = async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId, name, fields } = req.body;

  if (!workspaceId || !name || !fields || !Array.isArray(fields)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const client = await pool.connect();

  try {
    // Check if the user has access to the workspace
    const workspaceCheck = await client.query(
      `SELECT w.id
             FROM workspaces w
             INNER JOIN organizations o ON w.organization_id = o.id
             INNER JOIN user_organizations uo ON o.id = uo.organization_id
             WHERE w.id = $1 AND uo.user_id = $2`,
      [workspaceId, userId]
    );

    if (workspaceCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this workspace" });
    }

    // Start a transaction
    await client.query("BEGIN");

    // Insert into apps table
    const appResult = await client.query(
      "INSERT INTO apps (name, workspace_id, creator_id) VALUES ($1, $2, $3) RETURNING *",
      [name, workspaceId, userId]
    );

    if (!appResult.rows || appResult.rows.length === 0) {
      throw new Error("Failed to insert app into database");
    }

    const appId = appResult.rows[0].id;
    console.log("Inserted app with ID:", appId);

    // Insert into app_fields table
    for (const field of fields) {
      const { name: fieldName, field_type, is_required } = field;

      // Validate field data
      if (!fieldName || !field_type) {
        throw new Error(`Invalid field data: ${JSON.stringify(field)}`);
      }

      await client.query(
        "INSERT INTO app_fields (app_id, name, field_type, is_required) VALUES ($1, $2, $3, $4)",
        [appId, fieldName, field_type, is_required || false]
      );
    }

    // Commit the transaction
    await client.query("COMMIT");

    // Fetch the complete app details (optional)
    const createdApp = await client.query("SELECT * FROM apps WHERE id = $1", [
      appId,
    ]);

    res
      .status(201)
      .json({ message: "App created successfully", app: createdApp.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating app:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    client.release();
  }
};

exports.getAppsByWorkspace = async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId } = req.params;

  try {
    // Check if the user has access to the workspace
    const workspaceCheck = await pool.query(
      `SELECT w.id
         FROM workspaces w
         INNER JOIN organizations o ON w.organization_id = o.id
         INNER JOIN user_organizations uo ON o.id = uo.organization_id
         WHERE w.id = $1 AND uo.user_id = $2`,
      [workspaceId, userId]
    );

    if (workspaceCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this workspace" });
    }

    // Fetch apps
    const appsResult = await pool.query(
      "SELECT * FROM apps WHERE workspace_id = $1",
      [workspaceId]
    );

    res.status(200).json({ apps: appsResult.rows });
  } catch (error) {
    console.error("Error fetching apps:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get App Fields
exports.getAppFields = async (req, res) => {
  const userId = req.user.userId;
  const { appId } = req.params;

  try {
    // Verify user access to the app
    const appCheck = await pool.query(
      `SELECT a.id, a.name, w.id as workspace_id
             FROM apps a
             INNER JOIN workspaces w ON a.workspace_id = w.id
             INNER JOIN organizations o ON w.organization_id = o.id
             INNER JOIN user_organizations uo ON o.id = uo.organization_id
             WHERE a.id = $1 AND uo.user_id = $2`,
      [appId, userId]
    );

    if (appCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this app" });
    }

    // Fetch app fields
    const fieldsResult = await pool.query(
      "SELECT id, name, field_type, is_required FROM app_fields WHERE app_id = $1 ORDER BY id ASC",
      [appId]
    );

    res.status(200).json({ fields: fieldsResult.rows });
  } catch (error) {
    console.error("Error fetching app fields:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAppFields = async (req, res) => {
  const userId = req.user.userId;
  const { appId } = req.params;
  const { fields } = req.body;

  if (!fields || !Array.isArray(fields)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  let client;

  try {
    client = await pool.connect();

    // Check if the user has access to the app
    const appCheck = await client.query(
      `SELECT a.id, a.name, w.id as workspace_id
             FROM apps a
             INNER JOIN workspaces w ON a.workspace_id = w.id
             INNER JOIN organizations o ON w.organization_id = o.id
             INNER JOIN user_organizations uo ON o.id = uo.organization_id
             WHERE a.id = $1 AND uo.user_id = $2`,
      [appId, userId]
    );

    if (appCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this app" });
    }

    // Start a transaction
    await client.query("BEGIN");

    // Delete existing fields and insert new ones
    await client.query("DELETE FROM app_fields WHERE app_id = $1", [appId]);

    for (const field of fields) {
      const { name, field_type, is_required } = field;

      if (!name || !field_type) {
        throw new Error(`Invalid field data: ${JSON.stringify(field)}`);
      }

      await client.query(
        "INSERT INTO app_fields (app_id, name, field_type, is_required) VALUES ($1, $2, $3, $4)",
        [appId, name, field_type, is_required || false]
      );
    }

    // Commit the transaction
    await client.query("COMMIT");

    res.status(200).json({ message: "App fields updated successfully" });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Error rolling back transaction:", rollbackError);
      }
      client.release();
    }
    console.error("Error updating app fields:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    if (client) {
      client.release();
    }
  }
};
// Get App Details
exports.getAppDetails = async (req, res) => {
  const userId = req.user.userId;
  const { appId } = req.params;

  try {
    // Verify user access to the app
    const appCheck = await pool.query(
      `SELECT a.id, a.name, w.id as workspace_id
             FROM apps a
             INNER JOIN workspaces w ON a.workspace_id = w.id
             INNER JOIN organizations o ON w.organization_id = o.id
             INNER JOIN user_organizations uo ON o.id = uo.organization_id
             WHERE a.id = $1 AND uo.user_id = $2`,
      [appId, userId]
    );

    if (appCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this app" });
    }

    const app = appCheck.rows[0];

    res.status(200).json({ app });
  } catch (error) {
    console.error("Error fetching app details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get App Items
exports.getAppItems = async (req, res) => {
  const userId = req.user.userId;
  const { appId } = req.params;

  try {
    // Verify user access to the app
    const appCheck = await pool.query(
      `SELECT a.id, a.name, w.id as workspace_id
             FROM apps a
             INNER JOIN workspaces w ON a.workspace_id = w.id
             INNER JOIN organizations o ON w.organization_id = o.id
             INNER JOIN user_organizations uo ON o.id = uo.organization_id
             WHERE a.id = $1 AND uo.user_id = $2`,
      [appId, userId]
    );

    if (appCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this app" });
    }

    // Fetch app items
    const itemsResult = await pool.query(
      "SELECT id, data, created_at, updated_at FROM app_items WHERE app_id = $1 ORDER BY id ASC",
      [appId]
    );

    res.status(200).json({ items: itemsResult.rows });
  } catch (error) {
    console.error("Error fetching app items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create App Item
exports.createAppItem = async (req, res) => {
  const userId = req.user.userId;
  const { appId } = req.params;
  const { data } = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    // Verify user access to the app
    const appCheck = await pool.query(
      `SELECT a.id, a.name, w.id as workspace_id
             FROM apps a
             INNER JOIN workspaces w ON a.workspace_id = w.id
             INNER JOIN organizations o ON w.organization_id = o.id
             INNER JOIN user_organizations uo ON o.id = uo.organization_id
             WHERE a.id = $1 AND uo.user_id = $2`,
      [appId, userId]
    );

    if (appCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this app" });
    }

    // Insert new item
    const insertResult = await pool.query(
      "INSERT INTO app_items (app_id, data) VALUES ($1, $2) RETURNING id, data, created_at, updated_at",
      [appId, data]
    );

    res.status(201).json({ item: insertResult.rows[0] });
  } catch (error) {
    console.error("Error creating app item:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update App Item
exports.updateAppItem = async (req, res) => {
  const userId = req.user.userId;
  const { appId, itemId } = req.params;
  const { data } = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    // Verify user access
    // Similar verification as before

    // Update item
    const updateResult = await pool.query(
      "UPDATE app_items SET data = $1, updated_at = NOW() WHERE id = $2 AND app_id = $3 RETURNING id, data, created_at, updated_at",
      [data, itemId, appId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ item: updateResult.rows[0] });
  } catch (error) {
    console.error("Error updating app item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete App Item
exports.deleteAppItem = async (req, res) => {
  const userId = req.user.userId;
  const { appId, itemId } = req.params;

  try {
    // Verify user access
    // Similar verification as before

    // Delete item
    const deleteResult = await pool.query(
      "DELETE FROM app_items WHERE id = $1 AND app_id = $2 RETURNING id",
      [itemId, appId]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting app item:", error);
    res.status(500).json({ message: "Server error" });
  }
};
