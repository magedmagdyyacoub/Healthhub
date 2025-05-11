import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../style/Navbar.css'; // Import the new CSS file for styling

const Navbar = () => {
  const { user, logout } = useAuth();  // Get user and logout function from AuthContext
  const navigate = useNavigate();  // To navigate to different routes

  // Logout function
  const handleLogout = () => {
    logout();  // Clear user data from context and localStorage
    localStorage.removeItem('user');
    navigate('/');  // Redirect to homepage after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">Health Hub</h1>
        <div className="navbar-links">
          {user ? (
            <>
              <p className="welcome-message">Welcome, {user.name}</p>
              <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn login-btn" onClick={() => navigate('/login')}>Login</button>
              <button className="btn register-btn" onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
