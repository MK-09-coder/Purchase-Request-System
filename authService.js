
/**
 * @file authService.js
 * @description This file sets up authentication (SSO Authentication MicroService) using Google OAuth 2.0 with Passport.js, session management, and email notifications for login and logout events.
 * @requires dotenv
 * @requires express
 * @requires passport
 * @requires passport-google-oauth20
 * @requires express-session
 * @requires ./notificationService
 */

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { sendEmail } = require('./notificationService');

const app = express();

REACT_URI = process.env.REACT_APP_URI || 'http://localhost:3001';

/**
 * Session setup
 * @description Configures session management for the Express app.
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

/**
 * Initialize Passport
 * @description Initializes Passport.js for authentication.
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Google OAuth Strategy
 * @description Configures Passport.js to use Google OAuth 2.0 strategy for authentication.
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/callback'
  }, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
  }));

/**
 * Serialize user
 * @description Serializes user information into the session.
 * @param {Object} user - User object.
 * @param {Function} done - Callback function.
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Deserialize user
 * @description Deserializes user information from the session.
 * @param {Object} user - User object.
 * @param {Function} done - Callback function.
 */
passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * @route GET /auth/google
 * @description Initiates Google OAuth authentication.
 */
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route GET /auth/callback
 * @description Handles the callback after Google OAuth authentication.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/auth/callback', passport.authenticate('google', {
  failureRedirect: `${REACT_URI}`,
}), (req, res) => {
  sendEmail(req.user.emails[0].value, 'Login Successful', 'You have successfully logged in.'); //send an Email Notification post logging in
  res.redirect(`${REACT_URI}/choose-role`);
});

/**
 * @route GET /logout
 * @description Logs out the user and sends a logout email notification.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/logout', (req, res) => {
  const userEmail = req.user?.emails[0]?.value;
  req.logout((err) => {
    if (err) { return next(err); }
    if (userEmail) {
    sendEmail(userEmail, 'Log-Out Successful', 'You have successfully logged out.'); //send an email notification after logout.
    }
    res.redirect(`${REACT_URI}/`); // Redirect to frontend after logout
  });
});

/**
 * @route GET /user
 * @description Returns the authenticated user's information.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} User information or unauthorized message.
 */
app.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(req.user);
});

module.exports = app;