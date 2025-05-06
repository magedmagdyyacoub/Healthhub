const pool = require('../config/db');

// Get all specialties
const getAllSpecialties = async () => {
  try {
    const result = await pool.query('SELECT * FROM specialties ORDER BY id ASC');
    return result.rows;
  } catch (err) {
    console.error('Error fetching specialties:', err);
    throw err;
  }
};

// Get specialty by ID
const getSpecialtyById = async (id) => {
  const result = await pool.query('SELECT * FROM specialties WHERE id = $1', [id]);
  return result.rows[0];
};

// Create specialty
const createSpecialty = async (name) => {
  const result = await pool.query(
    'INSERT INTO specialties (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

// Update specialty
const updateSpecialty = async (id, name) => {
  const result = await pool.query(
    'UPDATE specialties SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
};

// Delete specialty
const deleteSpecialty = async (id) => {
  await pool.query('DELETE FROM specialties WHERE id = $1', [id]);
};

const getDoctorsBySpecialtyId = async (specialtyId) => {
  const query = `
    SELECT 
      u.id AS doctor_id,
      u.name,
      u.email,
      u.role,
      dws.day_of_work,
      dws.start_time,
      dws.end_time
    FROM users u
    INNER JOIN doctor_specialties ds ON u.id = ds.user_id
    LEFT JOIN doctor_work_schedule dws ON u.id = dws.user_id
    WHERE u.role = 'doctor' AND ds.specialty_id = $1
    ORDER BY u.id, dws.day_of_work
  `;

  const values = [specialtyId];
  const { rows } = await pool.query(query, values);

  // Group rows by doctor
  const doctorsMap = new Map();

  for (const row of rows) {
    const doctorId = row.doctor_id;

    if (!doctorsMap.has(doctorId)) {
      doctorsMap.set(doctorId, {
        id: doctorId,
        name: row.name,
        email: row.email,
        role: row.role,
        schedule: []
      });
    }

    if (row.day_of_work) {
      doctorsMap.get(doctorId).schedule.push({
        day: row.day_of_work,
        start: row.start_time,
        end: row.end_time
      });
    }
  }

  return Array.from(doctorsMap.values());
};


module.exports = {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getDoctorsBySpecialtyId,
};
