const MedecinModel = require('../models/medecinModel');
const RendezVousModel = require('../models/rendezVousModel');

const MedecinController = {
  async list(req, res) {
    try {
      const medecins = await MedecinModel.findAll();
      res.json(medecins);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getById(req, res) {
    try {
      const medecin = await MedecinModel.findById(req.params.id);
      if (!medecin) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }
      res.json(medecin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async create(req, res) {
    const { nom, specialite } = req.body;
    if (!nom || !specialite) {
      return res.status(400).json({ message: 'Nom et spécialité sont obligatoires' });
    }

    try {
      const medecin = await MedecinModel.create({ nom, specialite });
      res.status(201).json(medecin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async update(req, res) {
    const { nom, specialite } = req.body;
    if (!nom || !specialite) {
      return res.status(400).json({ message: 'Nom et spécialité sont obligatoires' });
    }

    try {
      const updated = await MedecinModel.update(req.params.id, { nom, specialite });
      if (!updated) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }
      res.json({ message: 'Médecin modifié avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await MedecinModel.deleteById(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }
      res.json({ message: 'Médecin supprimé avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getDisponibilites(req, res) {
    try {
      const dispos = await MedecinModel.getDisponibilites(req.params.id);
      res.json(dispos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async addDisponibilite(req, res) {
    const { jour, heure_debut, heure_fin } = req.body;

    if (!jour || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: 'Jour, heure de début et heure de fin sont obligatoires' });
    }

    const joursValides = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    if (!joursValides.includes(jour)) {
      return res.status(400).json({ message: 'Jour invalide' });
    }

    try {
      const medecin = await MedecinModel.findById(req.params.id);
      if (!medecin) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }
      const dispo = await MedecinModel.addDisponibilite(req.params.id, { jour, heure_debut, heure_fin });
      res.status(201).json(dispo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getCreneaux(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'La date est obligatoire (?date=AAAA-MM-JJ)' });
    }

    try {
      const medecin = await MedecinModel.findById(req.params.id);
      if (!medecin) {
        return res.status(404).json({ message: 'Médecin non trouvé' });
      }

      const joursMap = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      const [annee, mois, jour] = date.split('-').map(Number);
      const jourSemaine = joursMap[new Date(annee, mois - 1, jour).getDay()];

      const dispos = await MedecinModel.getDisponibilites(req.params.id);
      const disposDuJour = dispos.filter(d => d.jour === jourSemaine);

      if (disposDuJour.length === 0) {
        return res.json([]);
      }

      const creneaux = [];
      for (const dispo of disposDuJour) {
        const debut = dispo.heure_debut.substring(0, 5);
        const fin = dispo.heure_fin.substring(0, 5);
        let [h, m] = debut.split(':').map(Number);
        const [hFin, mFin] = fin.split(':').map(Number);

        while (h < hFin || (h === hFin && m < mFin)) {
          creneaux.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
          m += 30;
          if (m >= 60) { h++; m -= 60; }
        }
      }

      const rdvsPris = await RendezVousModel.findByMedecinAndDate(req.params.id, date);
      const heuresPrises = rdvsPris.map(h => h.substring(0, 5));

      res.json(creneaux.filter(c => !heuresPrises.includes(c)));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async removeDisponibilite(req, res) {
    try {
      const deleted = await MedecinModel.deleteDisponibilite(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Disponibilité non trouvée' });
      }
      res.json({ message: 'Disponibilité supprimée' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
};

module.exports = MedecinController;
