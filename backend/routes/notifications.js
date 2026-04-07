const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

router.get('/', auth, NotificationController.list);
router.get('/count', auth, NotificationController.countNonLues);
router.put('/lire-tout', auth, NotificationController.marquerToutesLues);
router.put('/:id/lire', auth, NotificationController.marquerLue);

module.exports = router;
