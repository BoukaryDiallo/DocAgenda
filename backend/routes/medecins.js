const express = require('express');
const router = express.Router();
const MedecinController = require('../controllers/medecinController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, MedecinController.list);
router.get('/:id', auth, MedecinController.getById);
router.get('/:id/disponibilites', auth, MedecinController.getDisponibilites);
router.get('/:id/creneaux', auth, MedecinController.getCreneaux);

router.post('/', auth, adminOnly, MedecinController.create);
router.put('/:id', auth, adminOnly, MedecinController.update);
router.delete('/:id', auth, adminOnly, MedecinController.remove);
router.post('/:id/disponibilites', auth, adminOnly, MedecinController.addDisponibilite);

module.exports = router;
