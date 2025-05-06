const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all doctors with their specialties
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await pool.query(`
      SELECT u.id, u.name, u.email, 
             COALESCE(s.id, 0) AS specialty_id, 
             COALESCE(s.name, 'Not Assigned') AS specialty_name
      FROM users u
      LEFT JOIN doctor_specialties ds ON u.id = ds.user_id
      LEFT JOIN specialties s ON s.id = ds.specialty_id
      WHERE u.role = 'doctor'
    `);
    res.json(doctors.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Assign or update a doctor's specialty
router.post('/doctors/:id/specialty', async (req, res) => {
  const userId = req.params.id;
  const { specialtyId } = req.body;

  if (!specialtyId) {
    return res.status(400).json({ error: 'Specialty ID is required' });
  }

  try {
    // Check if the specialty exists in the specialties table
    const specialtyExists = await pool.query('SELECT id FROM specialties WHERE id = $1', [specialtyId]);
    if (specialtyExists.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid specialty ID' });
    }

    // Check if the doctor already has this specialty
    const existingSpecialty = await pool.query('SELECT * FROM doctor_specialties WHERE user_id = $1', [userId]);
    if (existingSpecialty.rows.length > 0 && existingSpecialty.rows[0].specialty_id === specialtyId) {
      return res.status(400).json({ error: 'Doctor already has this specialty' });
    }

    // Remove the old specialty if exists
    await pool.query('DELETE FROM doctor_specialties WHERE user_id = $1', [userId]);

    // Insert the new specialty
    await pool.query(
      'INSERT INTO doctor_specialties (user_id, specialty_id) VALUES ($1, $2)',
      [userId, specialtyId]
    );

    res.json({ message: 'Specialty updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
