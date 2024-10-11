const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./Routes/authRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const organizationRoutes = require('./Routes/organizationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/organizations', organizationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
