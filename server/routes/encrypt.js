const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const API_BASE_URL = process.env.API_BASE_URL;

router.get('/keys', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/keys`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});

// ENCRYPT data
router.post('/encrypt', async (req, res) => {
    try {
        const apiKey = req.headers['furina-is-so-beautiful'];
        const response = await axios.post(`${API_BASE_URL}/encrypt`, req.body, {
            headers: {
                'furina-is-so-beautiful': apiKey,
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});

// DECRYPT data
router.post('/decrypt', async (req, res) => {
    try {
        const apiKey = req.headers['furina-is-so-beautiful'];
        const response = await axios.post(`${API_BASE_URL}/decrypt`, req.body, {
            headers: {
                'furina-is-so-beautiful': apiKey,
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});

module.exports = router;