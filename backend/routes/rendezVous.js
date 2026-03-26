const express = require('express');
const router = express.Router();
const RendezVousController = require('../controllers/rendezVousController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, RendezVousController.create);
router.get('/mes-rdv', auth, RendezVousController.mesRendezVous);

router.get('/', auth, adminOnly, RendezVousController.list);
router.put('/:id/statut', auth, adminOnly, RendezVousController.updateStatut);

router.get('/:id', auth, RendezVousController.getById);
router.delete('/:id', auth, RendezVousController.remove);

module.exports = router;
