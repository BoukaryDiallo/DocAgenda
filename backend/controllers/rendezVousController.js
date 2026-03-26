const RendezVousModel = require('../models/rendezVousModel');
const MedecinModel = require('../models/medecinModel');
const NotificationModel = require('../models/notificationModel');
const UserModel = require('../models/userModel');

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

const RendezVousController = {
  async create(req, res) {
    const { medecin_id, date_rdv, heure_rdv, motif } = req.body;

    if (!medecin_id || !date_rdv || !heure_rdv) {
      return res.status(400).json({ message: 'Médecin, date et heure sont obligatoires' });
    }

    try {
      const medecin = await MedecinModel.findById(medecin_id);
      if (!medecin) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }

      const conflit = await RendezVousModel.checkConflict(medecin_id, date_rdv, heure_rdv);
      if (conflit) {
        return res.status(409).json({ message: 'Ce créneau est déjà pris' });
      }

      const rdv = await RendezVousModel.create({
        patient_id: req.user.id, medecin_id, date_rdv, heure_rdv, motif,
      });

      const patient = await UserModel.findById(req.user.id);
      const date = formatDate(date_rdv);

      await NotificationModel.create({
        user_id: req.user.id,
        titre: 'Rendez-vous créé',
        message: `Votre RDV avec ${medecin.nom} le ${date} à ${heure_rdv} est en attente de confirmation.`,
        type: 'creation',
        rdv_id: rdv.id,
      });

      await NotificationModel.notifierAdmins({
        titre: 'Nouveau rendez-vous',
        message: `${patient.prenom} ${patient.nom} a pris RDV avec ${medecin.nom} le ${date} à ${heure_rdv}.`,
        type: 'creation',
        rdv_id: rdv.id,
      });

      res.status(201).json(rdv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async mesRendezVous(req, res) {
    try {
      const rdvs = await RendezVousModel.findByPatient(req.user.id);
      res.json(rdvs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async list(req, res) {
    try {
      const rdvs = await RendezVousModel.findAll();
      res.json(rdvs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getById(req, res) {
    try {
      const rdv = await RendezVousModel.findById(req.params.id);
      if (!rdv) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }

      if (req.user.role === 'patient' && rdv.patient_id !== req.user.id) {
        return res.status(403).json({ message: 'Accès interdit' });
      }

      res.json(rdv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async updateStatut(req, res) {
    const { statut } = req.body;

    if (!['en_attente', 'confirme', 'annule'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide (en_attente, confirmé, annulé)' });
    }

    try {
      const rdv = await RendezVousModel.findById(req.params.id);
      if (!rdv) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }

      await RendezVousModel.updateStatut(req.params.id, statut);

      const date = formatDate(rdv.date_rdv);
      const heure = rdv.heure_rdv.substring(0, 5);

      if (statut === 'confirme') {
        await NotificationModel.create({
          user_id: rdv.patient_id,
          titre: 'Rendez-vous confirmé',
          message: `Votre RDV avec ${rdv.medecin_nom} le ${date} à ${heure} a été confirmé.`,
          type: 'confirmation',
          rdv_id: rdv.id,
        });
      } else if (statut === 'annule') {
        await NotificationModel.create({
          user_id: rdv.patient_id,
          titre: 'Rendez-vous annulé',
          message: `Votre RDV avec ${rdv.medecin_nom} le ${date} à ${heure} a été annulé.`,
          type: 'annulation',
          rdv_id: rdv.id,
        });
      }

      res.json({ message: `Rendez-vous ${statut}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async remove(req, res) {
    try {
      const rdv = await RendezVousModel.findById(req.params.id);
      if (!rdv) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }

      if (req.user.role === 'patient' && rdv.patient_id !== req.user.id) {
        return res.status(403).json({ message: 'Accès interdit' });
      }

      await RendezVousModel.updateStatut(req.params.id, 'annule');

      if (req.user.role === 'patient') {
        const patient = await UserModel.findById(req.user.id);
        const date = formatDate(rdv.date_rdv);

        await NotificationModel.notifierAdmins({
          titre: 'RDV annulé par le patient',
          message: `${patient.prenom} ${patient.nom} a annulé son RDV avec ${rdv.medecin_nom} du ${date}.`,
          type: 'annulation',
          rdv_id: rdv.id,
        });
      }

      res.json({ message: 'Rendez-vous annulé' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
};

module.exports = RendezVousController;
