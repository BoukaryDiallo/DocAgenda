const db = require('../db');

const RendezVousModel = {
  async create({ patient_id, medecin_id, date_rdv, heure_rdv, motif }) {
    const [result] = await db.promise().execute(
      'INSERT INTO rendez_vous (patient_id, medecin_id, date_rdv, heure_rdv, motif) VALUES (?, ?, ?, ?, ?)',
      [patient_id, medecin_id, date_rdv, heure_rdv, motif || null]
    );
    return { id: result.insertId, patient_id, medecin_id, date_rdv, heure_rdv, motif, statut: 'en_attente' };
  },

  async findById(id) {
    const [rows] = await db.promise().execute(`
      SELECT rv.*, m.nom AS medecin_nom, m.specialite,
             u.nom AS patient_nom, u.prenom AS patient_prenom, u.telephone AS patient_telephone
      FROM rendez_vous rv
      JOIN medecins m ON rv.medecin_id = m.id
      JOIN users u ON rv.patient_id = u.id
      WHERE rv.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByPatient(patientId) {
    const [rows] = await db.promise().execute(`
      SELECT rv.*, m.nom AS medecin_nom, m.specialite
      FROM rendez_vous rv
      JOIN medecins m ON rv.medecin_id = m.id
      WHERE rv.patient_id = ?
      ORDER BY rv.date_rdv DESC, rv.heure_rdv DESC
    `, [patientId]);
    return rows;
  },

  async findAll() {
    const [rows] = await db.promise().execute(`
      SELECT rv.*, m.nom AS medecin_nom, m.specialite,
             u.nom AS patient_nom, u.prenom AS patient_prenom
      FROM rendez_vous rv
      JOIN medecins m ON rv.medecin_id = m.id
      JOIN users u ON rv.patient_id = u.id
      ORDER BY rv.date_rdv DESC, rv.heure_rdv DESC
    `);
    return rows;
  },

  async updateStatut(id, statut) {
    const [result] = await db.promise().execute(
      'UPDATE rendez_vous SET statut = ? WHERE id = ?',
      [statut, id]
    );
    return result.affectedRows > 0;
  },

  async deleteById(id) {
    const [result] = await db.promise().execute(
      'DELETE FROM rendez_vous WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },

  async findByMedecinAndDate(medecin_id, date_rdv) {
    const [rows] = await db.promise().execute(
      "SELECT heure_rdv FROM rendez_vous WHERE medecin_id = ? AND date_rdv = ? AND statut != 'annule'",
      [medecin_id, date_rdv]
    );
    return rows.map(r => r.heure_rdv);
  },

  async checkConflict(medecin_id, date_rdv, heure_rdv, excludeId = null) {
    let sql = `
      SELECT id FROM rendez_vous
      WHERE medecin_id = ? AND date_rdv = ? AND heure_rdv = ? AND statut != 'annule'
    `;
    const params = [medecin_id, date_rdv, heure_rdv];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    const [rows] = await db.promise().execute(sql, params);
    return rows.length > 0;
  },
};

module.exports = RendezVousModel;
