const NotificationModel = require('../models/notificationModel');

const NotificationController = {
  async list(req, res) {
    try {
      const notifications = await NotificationModel.findByUser(req.user.id);
      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async countNonLues(req, res) {
    try {
      const total = await NotificationModel.countNonLues(req.user.id);
      res.json({ total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async marquerLue(req, res) {
    try {
      const updated = await NotificationModel.marquerLue(req.params.id, req.user.id);
      if (!updated) {
        return res.status(404).json({ message: 'Notification non trouvée' });
      }
      res.json({ message: 'Notification lue' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async marquerToutesLues(req, res) {
    try {
      const count = await NotificationModel.marquerToutesLues(req.user.id);
      res.json({ message: `${count} notification(s) marquée(s) comme lue(s)` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
};

module.exports = NotificationController;
