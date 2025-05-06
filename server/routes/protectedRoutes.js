// server/routes/protectedRoutes.js
const express = require('express');
const passport = require('passport');
const authorize = require('../middleware/authorize');
const router = express.Router();

// Admin route
router.get('/admin', passport.authenticate('jwt', { session: false }), authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// Doctor route
router.get('/doctor', passport.authenticate('jwt', { session: false }), authorize('doctor'), (req, res) => {
  res.json({ message: 'Welcome, doctor!' });
});

// Patient route
router.get('/patient', passport.authenticate('jwt', { session: false }), authorize('patient'), (req, res) => {
  res.json({ message: 'Welcome, patient!' });
});

module.exports = router;
