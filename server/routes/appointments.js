const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Create appointment
router.post('/', async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

  if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check for existing appointment
    const existing = await pool.query(
      `SELECT * FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    // If no conflict, insert the appointment
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [patient_id, doctor_id, appointment_date, appointment_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get Appointment Details by ID
router.get('/:id', async (req, res) => { // No need for '/api' prefix here
  try {
    const { id } = req.params;

    // Query the appointment details including doctor name, date, and time
    const result = await pool.query(
      `SELECT a.id, u.name AS doctor_name, a.appointment_date, a.appointment_time
      FROM appointments a
      JOIN users u ON u.id = a.doctor_id
      WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = result.rows[0];
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get appointments for a specific patient
router.get('/patient/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid patient ID.' });
  }

  try {
    const result = await pool.query(
      `SELECT a.*, u.name AS doctor_name 
      FROM appointments a
      JOIN users u ON a.doctor_id = u.id
      WHERE a.patient_id = $1 ORDER BY a.appointment_date, a.appointment_time`,
      [parseInt(id)] // Ensure ID is an integer
    );

    res.json({ status: 'success', appointments: result.rows });
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
