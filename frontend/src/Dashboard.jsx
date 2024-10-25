
/**
 * Dashboard component that displays user information and their purchase requests.
 * 
 * @component
 * @example
 * return (
 *   <Dashboard />
 * )
 * 
 * @returns {JSX.Element} The rendered Dashboard component.
 * 
 * @description
 * This component fetches user data and purchase requests from the API and displays them.
 * It also handles user logout and navigation to the create request page.
 * 
 * @function
 * @name Dashboard
 * 
 * @property {Object} user - The user object containing user information.
 * @property {Array} myRequests - The list of purchase requests made by the user.
 * @property {string} message - The success message to be displayed in the modal.
 * 
 * @hook
 * @name useEffect
 * @description Fetches user data and purchase requests when the component mounts.
 * 
 * @hook
 * @name useState
 * @description Manages the state of user, myRequests, and message.
 * 
 * @hook
 * @name useNavigate
 * @description Provides navigation functionality.
 * 
 * @function
 * @name handleLogout
 * @description Redirects the user to the logout endpoint.
 * 
 * @function
 * @name handleCreateRequest
 * @description Navigates the user to the create request page.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import MessageModal from './MessageModal';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
      setMessage(successMessage);
      localStorage.removeItem('successMessage'); 
    }

    fetch(`${process.env.REACT_APP_API_URI}/user`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));

    fetch(`${process.env.REACT_APP_API_URI}/my-purchase-requests`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setMyRequests(data))
      .catch(error => console.error('Error fetching purchase requests:', error));
  }, []);

  const handleLogout = () => {
    window.location.href = `${process.env.REACT_APP_API_URI}/logout`;
  };

  const handleCreateRequest = () => {
    navigate('/create-request');
  };

  return (
    <div className="container">
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <div className="center">
            <button onClick={handleLogout}>Log Out</button>
            <button onClick={handleCreateRequest}>Create Purchase Request</button>
          </div>

          <div className="table-container">
            <h2>My Purchase Requests</h2>
            {myRequests.length > 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.itemName}</td>
                      <td>{request.unitPrice}</td>
                      <td>{request.quantity}</td>
                      <td>{request.deliveryCharges}</td>
                      <td>{request.taxAmount}</td>
                      <td>{request.totalPrice}</td>
                      <td className={`status-${request.status.toLowerCase()}`}>
                        {request.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No requests submitted yet.</p>
            )}
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
      <MessageModal message={message} onClose={() => setMessage('')} />
    </div>
  );
}

export default Dashboard;
