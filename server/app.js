const cors = require('cors');
const express = require('express');
const connectDB = require('./database/db');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/encrypt');

// Initialize
const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-type', 'Authorization', 'furina-is-so-beautiful'],
    credentials: true,
}));

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200); // Respond with OK for preflight requests
});

// Connect to database
connectDB();

app.use(express.json());

app.use('/api', apiRoutes); // For Encryption
app.use('/auth', authRoutes);

module.exports = app;