const express = require('express');
const router = express.Router();
const passport = require('passport');
const authorize = require('../middleware/authorize');
const pool = require('../config/db');

// Get doctor info (name, specialty)
router.get('/info', passport.authenticate('jwt', { session: false }), authorize('doctor'), async (req, res) => {
  try {
    const userId = req.user.id;

    // Get doctor name and email
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);

    // Get specialty
    const specialtyResult = await pool.query(`
      SELECT s.name 
      FROM specialties s
      JOIN doctor_specialties ds ON s.id = ds.specialty_id
      WHERE ds.user_id = $1
    `, [userId]);

    res.json({
      name: userResult.rows[0].name,
      email: userResult.rows[0].email,
      specialty: specialtyResult.rows[0]?.name || 'Not Set',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get doctor work schedule
router.get('/schedule', passport.authenticate('jwt', { session: false }), authorize('doctor'), async (req, res) => {
  const userId = req.user.id;
  const schedule = await pool.query(
    'SELECT * FROM doctor_work_schedule WHERE user_id = $1', // Updated to use user_id
    [userId]
  );
  res.json(schedule.rows);
});

// Get doctor appointments
router.get('/appointments', passport.authenticate('jwt', { session: false }), authorize('doctor'), async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query(`
    SELECT a.*, u.name AS patient_name
    FROM appointments a
    JOIN users u ON a.patient_id = u.id
    WHERE a.doctor_id = $1
  `, [userId]);
  res.json(result.rows);
});

// Create new schedule
router.post('/schedule', passport.authenticate('jwt', { session: false }), authorize('doctor'), async (req, res) => {
  try {
    const userId = req.user.id;  // Replaced doctorId with userId
    const { day_of_work, start_time, end_time } = req.body;

    const result = await pool.query(
      `INSERT INTO doctor_work_schedule (user_id, day_of_work, start_time, end_time) 
       VALUES ($1, $2, $3, $4) RETURNING *`, // Updated to use user_id
      [userId, day_of_work, start_time, end_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update schedule
router.put('/schedule/:id', passport.authenticate('jwt', { session: false }), authorize('doctor'), async (req, res) => {
  try {
    const userId = req.user.id;  // Replaced doctorId with userId
    const scheduleId = req.params.id;
    const { day_of_work, start_time, end_time } = req.body;

    // Corrected SQL query syntax
    const result = await pool.query(
      `UPDATE doctor_work_schedule
       SET day_of_work = $1, start_time = $2, end_time = $3
       WHERE id = $4 AND user_id = $5 RETURNING *`, // Added RETURNING * to get the updated row
      [day_of_work, start_time, end_time, scheduleId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Schedule not found or unauthorized' });
    }

    res.json(result.rows[0]); // Return the updated schedule details
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete schedule
router.delete('/schedule/:id', passport.authenticate('jwt', { session: false }), authorize('doctor'), async (req, res) => {
  try {
    const userId = req.user.id;  // Replaced doctorId with userId
    const scheduleId = req.params.id;

    const result = await pool.query(
      `DELETE FROM doctor_work_schedule WHERE id = $1 AND user_id = $2 RETURNING *`, // Updated to use user_id
      [scheduleId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Schedule not found or unauthorized' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
