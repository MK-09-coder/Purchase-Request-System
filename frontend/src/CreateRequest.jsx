
/**
 * CreateRequest component allows users to create a new purchase request.
 * 
 * @component
 * @example
 * return (
 *   <CreateRequest />
 * )
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @description
 * This component provides a form for users to input details for a new purchase request,
 * including item name, quantity, unit price, delivery charges, tax amount, and approver's email.
 * Upon submission, the form data is sent to the backend API to create a new purchase request.
 * 
 * @property {Object} purchaseRequest - State object containing the purchase request details.
 * @property {string} purchaseRequest.itemName - Name of the item.
 * @property {string} purchaseRequest.quantity - Quantity of the item.
 * @property {string} purchaseRequest.unitPrice - Unit price of the item.
 * @property {string} purchaseRequest.deliveryCharges - Delivery charges for the item.
 * @property {string} purchaseRequest.taxAmount - Tax amount for the item.
 * @property {string} purchaseRequest.approverEmail - Email of the approver.
 * 
 * @property {boolean} isSubmitting - State indicating whether the form is being submitted.
 * @property {string} message - State for the message to be displayed in the modal.
 * 
 * @function handleInputChange - Handles input changes and updates the purchaseRequest state.
 * @param {Object} e - Event object from the input change.
 * 
 * @function handleSubmit - Handles form submission, sends data to the backend API, and manages the submission state.
 * @param {Object} e - Event object from the form submission.
 * 
 * @requires useState - React hook to manage component state.
 * @requires useNavigate - React Router hook to navigate programmatically.
 * @requires MessageModal - Component to display messages in a modal.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageModal from './MessageModal'; // Import the modal

function CreateRequest() {
  const [purchaseRequest, setPurchaseRequest] = useState({
    itemName: '',
    quantity: '',
    unitPrice: '',
    deliveryCharges: '',
    taxAmount: '',
    approverEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');  // State for message modal
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseRequest(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    fetch(`${process.env.REACT_APP_API_URI}/purchase-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(purchaseRequest)
    })
    .then(response => {
      setIsSubmitting(false);
      if (!response.ok) {
        throw new Error(`Failed to create request, status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('successMessage', 'Purchase request created successfully.');
      console.log('Purchase request created:', data);
      navigate('/dashboard');  // Redirect back to dashboard
    })
    .catch(error => {
      setMessage('Failed to create purchase request.');
      console.error('Error creating purchase request:', error);
    });
  };

  return (
    <div>
      <h2>Create Purchase Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={purchaseRequest.itemName}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={purchaseRequest.quantity}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="unitPrice"
          placeholder="Unit Price"
          value={purchaseRequest.unitPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="deliveryCharges"
          placeholder="Delivery Charges"
          value={purchaseRequest.deliveryCharges}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="taxAmount"
          placeholder="Tax Amount"
          value={purchaseRequest.taxAmount}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="approverEmail"
          placeholder="Approver's Email"
          value={purchaseRequest.approverEmail}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={isSubmitting}>Submit Purchase Request</button>
      </form>
      {isSubmitting && <p>Submitting...</p>}

      <MessageModal message={message} onClose={() => setMessage('')} />
    </div>
  );
}

export default CreateRequest;
