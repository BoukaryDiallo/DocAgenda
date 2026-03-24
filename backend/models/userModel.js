const db = require('../db');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.promise().execute(
      'SELECT id, nom, prenom, email, telephone, role, created_at FROM users WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  async create({ nom, prenom, email, telephone, password, role = 'patient' }) {
    const [result] = await db.promise().execute(
      'INSERT INTO users (nom, prenom, email, telephone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, telephone || null, password, role]
    );
    return { id: result.insertId, nom, prenom, email, telephone, role };
  },

  async findAllPatients() {
    const [rows] = await db.promise().execute(
      "SELECT id, nom, prenom, email, telephone, created_at FROM users WHERE role = 'patient' ORDER BY created_at DESC"
    );
    return rows;
  },

  async deleteById(id) {
    const [result] = await db.promise().execute(
      'DELETE FROM users WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
