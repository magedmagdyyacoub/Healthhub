// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize'); // Importing the authorization middleware

// Route to get all users (for admin)
router.get('/', isAuthenticated, authorize('admin'), userController.getUsers);

// Route to update user role (for admin)
router.put('/:id/role', isAuthenticated, authorize('admin'), userController.updateUserRole);

// Route to delete a user (for admin)
router.delete('/:id', isAuthenticated, authorize('admin'), userController.deleteUser);

module.exports = router;
