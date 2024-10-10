// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const taskRoutes = require("./Routes/taskRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));