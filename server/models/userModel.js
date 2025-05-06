// server/models/userModel.js
const pool = require('../config/db');

// Create a new user
exports.createUser = async (name, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

// Find a user by email
exports.findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Get all users with pagination
exports.getAllUsers = async (limit, offset) => {
  const result = await pool.query(
    'SELECT * FROM users LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

// Get the total number of users for pagination
exports.getTotalUsers = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM users');
  return parseInt(result.rows[0].count); // Return total count of users
};

// Update the role of a user
exports.updateUserRole = async (id, role) => {
  const result = await pool.query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
    [role, id]
  );
  return result.rows[0];
};

// Delete a user
exports.deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
