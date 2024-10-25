
/**
 * @file purchaseRequest.js
 * @description Defines the schema and model for Purchase Requests in the purchase-app.
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} PurchaseRequest
 * @property {string} requester - The name of the person making the purchase request.
 * @property {string} requesterEmail - The email of the person making the purchase request.
 * @property {string} itemName - The name of the item being requested.
 * @property {number} quantity - The quantity of the item being requested.
 * @property {number} unitPrice - The unit price of the item being requested.
 * @property {number} deliveryCharges - The delivery charges for the item.
 * @property {number} taxAmount - The tax amount for the item.
 * @property {number} totalPrice - The total price for the item including delivery charges and tax.
 * @property {string} approverEmail - The email of the person who will approve the purchase request.
 * @property {string} status - The status of the purchase request. Can be 'Pending', 'Approved', or 'Rejected'.
 * @property {Date} createdAt - The date and time when the purchase request was created.
 * @property {Date} updatedAt - The date and time when the purchase request was last updated.
 */

/**
 * @module PurchaseRequest
 * @description Mongoose model for Purchase Requests.
 * @requires mongoose
 */

const purchaseRequestSchema = new mongoose.Schema({
    requester: { type: String, required: true },
    requesterEmail: { type: String, required: true }, 
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    deliveryCharges: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    approverEmail: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

purchaseRequestSchema.index({ approverEmail: 1, status: 1 });

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);

module.exports = PurchaseRequest;
