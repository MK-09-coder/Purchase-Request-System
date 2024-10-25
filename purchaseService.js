
/**
 * @file purchaseService.js
 * @description This file contains the implementation of the purchase service (Purchase MicroService) using Express.js. It handles purchase requests, including creation, approval, and rejection, and sends notification emails.
 */

const express = require('express');
const PurchaseRequest = require('./models/purchaseRequest'); 
const { sendEmail } = require('./notificationService'); // Importing notification microservice for sending emails
const app = express();
app.use(express.json());

const approvalLink = `${process.env.REACT_APP_URI}`;
/**
 * Middleware to check authentication.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns a 401 status if not authenticated.
 */
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
  return emailRegex.test(email);
};

/**
 * GET /dashboard
 * @description Renders the dashboard with a welcome message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`<h1>Welcome ${req.user.displayName}</h1>`);
});

/**
 * GET /my-purchase-requests
 * @description Fetches the authenticated user's purchase requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns the user's purchase requests or an error message.
 */
app.get('/my-purchase-requests', isAuthenticated, async (req, res) => {
  if (!req.user || !req.user.displayName) {
    return res.status(401).json({ message: 'Unauthorized: User data not available' });
  }

  const requester = req.user.displayName;

  try {
    const myRequests = await PurchaseRequest.find({ requester });

    if (myRequests.length > 0) {
      res.json(myRequests);
    } else {
      res.status(404).json({ message: 'No requests found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase requests', error });
  }
});

/**
 * POST /purchase-request
 * @description Creates a new purchase request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns the created purchase request or an error message.
 */
app.post('/purchase-request', isAuthenticated, async (req, res) => {
  const { itemName, quantity, unitPrice, deliveryCharges, taxAmount, approverEmail } = req.body;

  if (!validateEmail(approverEmail)) {
    return res.status(400).json({ message: 'Invalid approver email format.' });
  }
  if (quantity <= 0 || unitPrice <= 0 || deliveryCharges < 0 || taxAmount < 0) {
    return res.status(400).json({ message: 'Invalid input values. Quantity, Unit Price must be greater than zero, and charges must be non-negative.' });
  }

  const totalPrice = (quantity * unitPrice) + parseInt(deliveryCharges) + parseInt(taxAmount);

  try {
    const newRequest = new PurchaseRequest({
      requester: req.user.displayName,
      requesterEmail: req.user.emails[0].value,
      itemName,
      quantity,
      unitPrice,
      totalPrice,
      deliveryCharges,
      taxAmount,
      approverEmail,
      status: 'Pending'
    });

    await newRequest.save(); // Save to MongoDB

    // Send notification emails
    sendEmail(req.user.emails[0].value, 'Purchase Request Created', `Your request for ${itemName} has been created.`);

    sendEmail(
      approverEmail,
      'Approval Needed',
      `A purchase request for ${itemName} needs your approval. Click here: ${approvalLink}`, // Fallback text
      `
        <p>A purchase request for ${itemName} needs your approval.</p>
        <p>
          <a href="${approvalLink}" style="
            display: inline-block;
            padding: 5px 10px;
            font-size: 16px;
            color: #ffffff;
            background-color: #f86011;
            text-decoration: none;
            border-radius: 5px;">
            Review and Approve
          </a>
        </p>
      `
    );

    res.status(201).json({ message: 'Purchase request created', newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase request', error });
  }
});

/**
 * GET /pending-purchase-requests
 * @description Fetches pending purchase requests for manager approval.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns the pending purchase requests or an error message.
 */
app.get('/pending-purchase-requests', isAuthenticated, async (req, res) => {
  const approverEmail = req.user.emails[0].value;

  try {
    const pendingRequests = await PurchaseRequest.find({ approverEmail, status: 'Pending' });
    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending requests', error });
  }
});

/**
 * POST /approve-purchase-request
 * @description Approves a purchase request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns the approved purchase request or an error message.
 */
app.post('/approve-purchase-request', isAuthenticated, async (req, res) => {
  const { itemName } = req.body;
  const approverEmail = req.user.emails[0].value;

  try {
    const requestToApprove = await PurchaseRequest.findOneAndUpdate(
      { itemName, approverEmail, status: 'Pending' },
      { status: 'Approved' },
      { new: true } // Return the updated document
    );

    if (!requestToApprove) {
      const checkRequest = await PurchaseRequest.findOne({ itemName, status: 'Pending' });
      if (checkRequest) {
        return res.status(403).json({ message: 'You are not authorized to approve this request.' });
      }

      return res.status(404).json({ message: 'Purchase request not found or already approved.' });
    }

    sendEmail(approverEmail, 'Purchase Request Approved', `You have approved the request for ${itemName}.`);
    sendEmail(requestToApprove.requesterEmail, 'Request Approved', `Your request for ${itemName} has been approved.`);
    res.status(200).json({ message: 'Purchase request approved', requestToApprove });

  } catch (error) {
    res.status(500).json({ message: 'Error approving request', error });
  }
});

/**
 * POST /reject-purchase-request
 * @description Rejects a purchase request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - Returns the rejected purchase request or an error message.
 */
app.post('/reject-purchase-request', isAuthenticated, async (req, res) => {
  const { itemName } = req.body;
  const approverEmail = req.user.emails[0].value;

  try {
    const requestToReject = await PurchaseRequest.findOneAndUpdate(
      { itemName, approverEmail, status: 'Pending' },
      { status: 'Rejected' },
      { new: true }
    );

    if (requestToReject) {
      sendEmail(approverEmail, 'Purchase Request Rejected', `You have rejected the request for ${itemName}.`);
      sendEmail(requestToReject.requesterEmail, 'Request Rejected', `Your request for ${itemName} has been rejected.`);
      res.status(200).json({ message: 'Purchase request rejected', requestToReject });
    } else {
      res.status(404).json({ message: 'Purchase request not found or already handled' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request', error });
  }
});

module.exports = app;