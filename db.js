
/**
 * @fileoverview This module handles the connection to a MongoDB database using Mongoose.
 * It loads environment variables from a .env file and connects to the MongoDB URI specified in the environment variables.
 * 
 * @requires mongoose - Mongoose library for MongoDB object modeling.
 * @requires dotenv/config - Loads environment variables from a .env file.
 * 
 * @constant {string} mongoURI - The MongoDB URI retrieved from the environment variables.
 * 
 * @function connectDB
 * @async
 * @description Asynchronously connects to the MongoDB database using the Mongoose library.
 * @throws Will throw an error if the connection to MongoDB fails.
 * @returns {Promise<void>} A promise that resolves if the connection is successful.
 * 
 * @example
 * const connectDB = require('./db');
 * connectDB();
 */
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Get MongoDB URI from the .env file
const mongoURI = process.env.MONGO_DB_URI;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Failed to connect to MongoDB', error);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

module.exports = connectDB;
