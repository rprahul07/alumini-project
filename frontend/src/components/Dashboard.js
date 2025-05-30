import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
      localStorage.removeItem('userRole');
      navigate('/auth');
    } catch (error) {
      // Silent error handling for logout
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to the Alumni Portal</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="dashboard-content">
        <p>Dashboard content will be added here.</p>
      </div>
    </div>
  );
}

export default Dashboard; 