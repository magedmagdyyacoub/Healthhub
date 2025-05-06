const Specialty = require('../models/specialtyModel');

// Import getDoctorsBySpecialtyId correctly ✅
const { getDoctorsBySpecialtyId } = require('../models/specialtyModel');

const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.getAllSpecialties();
    console.log('Specialties:', specialties);
    if (specialties.length === 0) {
      return res.status(404).json({ message: 'No specialties found' });
    }
    res.json(specialties);
  } catch (err) {
    console.error('Error in controller:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getSpecialtyById = async (req, res) => {
  try {
    const id = req.params.id;
    const specialty = await Specialty.getSpecialtyById(id);
    if (!specialty) return res.status(404).json({ error: 'Specialty not found' });
    res.json(specialty);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createSpecialty = async (req, res) => {
  try {
    const { name } = req.body;
    const newSpecialty = await Specialty.createSpecialty(name);
    res.status(201).json(newSpecialty);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateSpecialty = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const updated = await Specialty.updateSpecialty(id, name);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    const id = req.params.id;
    await Specialty.deleteSpecialty(id);
    res.json({ message: 'Specialty deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getDoctorsBySpecialtyIdController = async (req, res) => {
  try {
    const specialtyId = req.params.id;
    const doctors = await getDoctorsBySpecialtyId(specialtyId);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getDoctorsBySpecialtyIdController, // ✅ Correct
};
