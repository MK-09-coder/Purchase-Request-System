
/**
 * @file app.js
 * @description Main server file for the purchase application.
 * @requires express
 * @requires cors
 * @requires ./db
 * @requires passport
 * @requires ./authService
 * @requires ./purchaseService
 * @constant {string} SERVER_URI - The URI for the server, defaults to 'http://localhost:3000'.
 * @constant {string} REACT_URI - The URI for the React frontend, defaults to 'http://localhost:3001'.
 * @constant {object} app - The Express application instance.
 * @function getPortFromURI - Extracts the port number from a given URI.
 * @param {string} uri - The URI from which to extract the port.
 * @returns {number} - The port number extracted from the URI, defaults to 3000 if not specified.
 * @constant {number} PORT - The port number on which the server listens.
 * @function listen - Starts the server and listens on the specified port.
 * @param {number} PORT - The port number on which the server listens.
 * @callback listenCallback - Logs a message indicating the server is running and the URI it is running on.
 */
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const passport = require('passport');
const authService = require('./authService'); // Import the Auth Microservice
const purchaseService = require('./purchaseService'); // Import the Purchase Microservice
SERVER_URI = process.env.REACT_APP_API_URI || 'http://localhost:3000';
REACT_URI = process.env.REACT_APP_URI || 'http://localhost:3001';
const app = express();
app.use(cors({ origin: REACT_URI, credentials: true }));
connectDB(); 

app.use(authService);
app.use(purchaseService);
app.use(express.json());


const getPortFromURI = (uri) => {
  const url = new URL(uri);
  return url.port || 3000;
};

const PORT = getPortFromURI(SERVER_URI);

app.listen(PORT, () => {
  console.log(`Server running on ${SERVER_URI}`);
});
