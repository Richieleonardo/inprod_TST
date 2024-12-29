const mongoose = require("mongoose");
require('dotenv').config();

const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1); // Exit the app if the database connection fails.
    }
};

module.exports = connectDB;
