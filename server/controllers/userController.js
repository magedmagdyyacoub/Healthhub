// server/controllers/userController.js
const userModel = require('../models/userModel');

// Get all users with pagination
exports.getUsers = async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Default page is 1, limit is 6
  const offset = (page - 1) * limit; // Calculate the offset

  try {
    // Assuming `userModel.getAllUsers` accepts `limit` and `offset` as arguments
    const users = await userModel.getAllUsers(limit, offset);

    // Assuming you also want to know the total number of users for pagination info
    const totalUsers = await userModel.getTotalUsers(); // A function to count total users

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit), // Total pages calculation
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // Expecting role as 'admin', 'doctor', 'patient'

  try {
    const updatedUser = await userModel.updateUserRole(id, role);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User role updated successfully',
      updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userModel.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
