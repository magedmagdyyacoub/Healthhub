const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');

// Normal routes
router.get('/', specialtyController.getAllSpecialties);
router.get('/:id', specialtyController.getSpecialtyById);

// ✅ Fix this line
router.get('/:id/doctors', specialtyController.getDoctorsBySpecialtyIdController);

router.post('/', specialtyController.createSpecialty);
router.put('/:id', specialtyController.updateSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);

module.exports = router;
