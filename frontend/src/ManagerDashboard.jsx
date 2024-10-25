
/**
 * ManagerDashboard component is responsible for displaying the manager's dashboard.
 * It fetches the logged-in user data and pending purchase requests from the server.
 * The manager can approve or reject purchase requests, and log out from the dashboard.
 *
 * @component
 * @example
 * return (
 *   <ManagerDashboard />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @typedef {Object} User
 * @property {string} displayName - The display name of the logged-in user.
 *
 * @typedef {Object} Request
 * @property {string} _id - The unique identifier of the purchase request.
 * @property {string} itemName - The name of the item requested.
 * @property {number} unitPrice - The unit price of the item.
 * @property {number} quantity - The quantity of the item requested.
 * @property {number} deliveryCharges - The delivery charges for the item.
 * @property {number} taxAmount - The tax amount for the item.
 * @property {number} totalPrice - The total price for the item.
 * @property {string} status - The status of the purchase request.
 *
 * @typedef {Object} MessageModalProps
 * @property {string} message - The message to be displayed in the modal.
 * @property {function} onClose - The function to call when the modal is closed.
 *
 * @function handleApprove
 * @description Approves a purchase request.
 * @param {string} itemName - The name of the item to approve.
 *
 * @function handleReject
 * @description Rejects a purchase request.
 * @param {string} itemName - The name of the item to reject.
 *
 * @function handleLogout
 * @description Logs out the user.
 */
import React, { useEffect, useState } from 'react';
import MessageModal from './MessageModal'; // Import the modal
import './styles.css';  // Import the CSS file

function ManagerDashboard() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the logged-in user data
    fetch(`${process.env.REACT_APP_API_URI}/user`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch pending purchase requests
    fetch(`${process.env.REACT_APP_API_URI}/pending-purchase-requests`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setRequests(data))
      .catch(error => console.error('Error fetching purchase requests:', error));
  }, []);

  const handleApprove = (itemName) => {
    fetch(`${process.env.REACT_APP_API_URI}/approve-purchase-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ itemName })
    })
      .then(response => response.json())
      .then(data => {
        setRequests(requests.filter(req => req.itemName !== itemName));  // Remove approved request
        setMessage(`Purchase request for ${itemName} approved successfully.`);
      })
      .catch(error => {
        setMessage(`Failed to approve purchase request for ${itemName}.`);
      });
  };

  const handleReject = (itemName) => {
    fetch(`${process.env.REACT_APP_API_URI}/reject-purchase-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ itemName })
    })
      .then(response => response.json())
      .then(data => {
        setRequests(requests.filter(req => req.itemName !== itemName));  // Remove rejected request
        setMessage(`Purchase request for ${itemName} rejected.`);
      })
      .catch(error => {
        setMessage(`Failed to reject purchase request for ${itemName}.`);
      });
  };

  const handleLogout = () => {
    window.location.href = `${process.env.REACT_APP_API_URI}/logout`;
  };

  return (
    <div className="container">
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <div className="center">
            <button onClick={handleLogout}>Log Out</button>
          </div>

          <div className="table-container">
            <h2>Pending Purchase Requests</h2>
            {requests.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Delivery Charges</th>
                    <th>Tax Amount</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.itemName}</td>
                      <td>{request.unitPrice}</td>
                      <td>{request.quantity}</td>
                      <td>{request.deliveryCharges}</td>
                      <td>{request.taxAmount}</td>
                      <td>{request.totalPrice}</td>
                      <td>{request.status}</td>
                      <td>
                        <button className="approve" onClick={() => handleApprove(request.itemName)}>Approve</button>
                        <button className="reject" onClick={() => handleReject(request.itemName)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pending requests.</p>
            )}
          </div>
          <MessageModal message={message} onClose={() => setMessage('')} />
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default ManagerDashboard;
