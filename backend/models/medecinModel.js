const db = require('../db');

const MedecinModel = {
  async findAll() {
    const [rows] = await db.promise().execute(
      'SELECT * FROM medecins ORDER BY nom ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM medecins WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  async create({ nom, specialite }) {
    const [result] = await db.promise().execute(
      'INSERT INTO medecins (nom, specialite) VALUES (?, ?)',
      [nom, specialite]
    );
    return { id: result.insertId, nom, specialite };
  },

  async update(id, { nom, specialite }) {
    const [result] = await db.promise().execute(
      'UPDATE medecins SET nom = ?, specialite = ? WHERE id = ?',
      [nom, specialite, id]
    );
    return result.affectedRows > 0;
  },

  async deleteById(id) {
    const [result] = await db.promise().execute(
      'DELETE FROM medecins WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },

  async getDisponibilites(medecinId) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM disponibilites WHERE medecin_id = ? ORDER BY FIELD(jour, "lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"), heure_debut',
      [medecinId]
    );
    return rows;
  },

  async addDisponibilite(medecinId, { jour, heure_debut, heure_fin }) {
    const [result] = await db.promise().execute(
      'INSERT INTO disponibilites (medecin_id, jour, heure_debut, heure_fin) VALUES (?, ?, ?, ?)',
      [medecinId, jour, heure_debut, heure_fin]
    );
    return { id: result.insertId, medecin_id: medecinId, jour, heure_debut, heure_fin };
  },

  async deleteDisponibilite(id) {
    const [result] = await db.promise().execute(
      'DELETE FROM disponibilites WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = MedecinModel;
