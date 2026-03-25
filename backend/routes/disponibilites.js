const express = require('express');
const router = express.Router();
const MedecinController = require('../controllers/medecinController');
const { auth, adminOnly } = require('../middleware/auth');

router.delete('/:id', auth, adminOnly, MedecinController.removeDisponibilite);

module.exports = router;
