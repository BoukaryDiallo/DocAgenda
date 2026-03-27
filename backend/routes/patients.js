const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, PatientController.list);
router.get('/:id', auth, adminOnly, PatientController.getById);
router.delete('/:id', auth, adminOnly, PatientController.remove);

module.exports = router;
