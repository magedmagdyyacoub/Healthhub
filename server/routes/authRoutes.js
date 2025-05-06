const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const isStrongPassword = require('../utils/validatePassword');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    'your_jwt_secret',
    { expiresIn: '1d' }
  );
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role = 'patient' } = req.body;

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: 'Password is too weak. It must be at least 8 characters, contain upper and lower case letters, a number, a special character, and not be a common password.'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});



module.exports = router;
