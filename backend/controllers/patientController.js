const UserModel = require('../models/userModel');
const RendezVousModel = require('../models/rendezVousModel');

const PatientController = {
  async list(req, res) {
    try {
      const patients = await UserModel.findAllPatients();
      res.json(patients);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getById(req, res) {
    try {
      const patient = await UserModel.findById(req.params.id);
      if (!patient || patient.role !== 'patient') {
        return res.status(404).json({ message: 'Patient non trouvé' });
      }
      res.json(patient);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async remove(req, res) {
    try {
      const patient = await UserModel.findById(req.params.id);
      if (!patient || patient.role !== 'patient') {
        return res.status(404).json({ message: 'Patient non trouvé' });
      }

      const rdvs = await RendezVousModel.findByPatient(req.params.id);
      const rdvsActifs = rdvs.filter(r => r.statut !== 'annule');
      if (rdvsActifs.length > 0) {
        return res.status(409).json({
          message: `Ce patient a ${rdvsActifs.length} rendez-vous actif(s). Annulez-les avant de supprimer le patient.`,
        });
      }

      await UserModel.deleteById(req.params.id);
      res.json({ message: 'Patient supprimé avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
};

module.exports = PatientController;
