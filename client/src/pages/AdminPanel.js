import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; // Assuming you have a Sidebar component

const AdminPanel = () => {
  return (
    <div>
      <Navbar />
      <Sidebar /> {/* Include the Sidebar component */}
      <h1>Welcome to the Admin Panel</h1>
      {/* Add more components or content specific to the admin panel */}
    </div>
  );
};

export default AdminPanel;
