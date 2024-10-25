
/**
 * ChooseRole component allows the user to select their role as either a Requester or an Approver.
 * Depending on the selection, the user is navigated to the appropriate dashboard.
 *
 * @component
 * @example
 * return (
 *   <ChooseRole />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChooseRole() {
  const navigate = useNavigate();

  const handleRequesterClick = () => {
    navigate('/dashboard');
  };

  const handleApproverClick = () => {
    navigate('/manager-dashboard');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Choose Your Role</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button style={{ padding: '10px 20px', fontSize: '16px' }} onClick={handleRequesterClick}>
          Requester
        </button>
        <button style={{ padding: '10px 20px', fontSize: '16px' }} onClick={handleApproverClick}>
          Approver
        </button>
      </div>
    </div>
  );
}

export default ChooseRole;
