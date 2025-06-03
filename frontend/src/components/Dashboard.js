import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Dashboard({ onLogout, userRole }) {
  const navigate = useNavigate();
  const isAdmin = userRole === 'admin';

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
        <div className="dashboard-nav">
          {isAdmin && (
            <Link to="/admin/logs" className="nav-link">
              System Logs
            </Link>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        {isAdmin ? (
          <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="admin-links">
              <Link to="/admin/logs" className="admin-link">
                View System Logs
              </Link>
              {/* Add more admin links here */}
            </div>
          </div>
        ) : (
          <div className="user-dashboard">
            <p>Welcome to your dashboard. More features coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 