
/**
 * App component that sets up the main routes for the application.
 * 
 * @component
 * @example
 * return (
 *   <App />
 * )
 * 
 * Routes:
 * - `/dashboard`: Renders the Dashboard component for Requester.
 * - `/manager-dashboard`: Renders the ManagerDashboard component for Approver.
 * - `/choose-role`: Renders the ChooseRole component for user to select either requester or approver.
 * - `/create-request`: Renders the CreateRequest component for creating a purchase request.
 * - `/`: Renders the home page with a Google login button.
 * 
 * @returns {JSX.Element} The rendered App component.
 */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import './App.css';
import ManagerDashboard from './ManagerDashboard';
import ChooseRole from './ChooseRole';
import CreateRequest from './CreateRequest';  

function App() {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URI}/auth/google`;
  };

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/create-request" element={<CreateRequest />} /> {/* New route */}
        <Route
          path="/"
          element={
            <div className="app-container">  {/* Center container */}
              <h1>Purchase Request - Requester and Approver System</h1>
              <button className="google-login-btn" onClick={handleLogin}>Login with Google</button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
