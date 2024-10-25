
/**
 * MessageModal component renders a modal with a message and an OK button to close it.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display in the modal
 * @param {function} props.onClose - Function to call when the OK button is clicked
 * @returns {JSX.Element|null} The rendered modal component or null if no message is provided
 */
import React from 'react';
import './styles.css';  // Assuming you have your styles here

function MessageModal({ message, onClose }) {
  if (!message) return null; // If no message, don't render anything

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default MessageModal;
