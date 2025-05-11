// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation
import '../style/Sidebar.css'; // Import the CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <ul className="sidebar-list">
        <li>
          <Link to="/admin" className="sidebar-item">
            <i className="fa fa-tachometer-alt"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="sidebar-item">
            <i className="fa fa-users"></i> Users
          </Link>
        </li>
        
        <li>
          <Link to="/admin/specialties" className="sidebar-item">
            <i className="fa fa-stethoscope"></i> Specialties
          </Link>
        </li>
        <li>
  <Link to="/admin/doctor-specialties" className="sidebar-item">
    <i className="fa fa-user-md"></i> Doctor's Specialties
  </Link>
</li>

      </ul>
    </div>
  );
};

export default Sidebar;
