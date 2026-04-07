const db = require('../db');

const NotificationModel = {
  async create({ user_id, titre, message, type, rdv_id }) {
    const [result] = await db.promise().execute(
      'INSERT INTO notifications (user_id, titre, message, type, rdv_id) VALUES (?, ?, ?, ?, ?)',
      [user_id, titre, message, type, rdv_id || null]
    );
    return { id: result.insertId, user_id, titre, message, type, rdv_id, lue: false };
  },

  async findByUser(userId) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async countNonLues(userId) {
    const [rows] = await db.promise().execute(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND lue = FALSE',
      [userId]
    );
    return rows[0].total;
  },

  async marquerLue(id, userId) {
    const [result] = await db.promise().execute(
      'UPDATE notifications SET lue = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async marquerToutesLues(userId) {
    const [result] = await db.promise().execute(
      'UPDATE notifications SET lue = TRUE WHERE user_id = ? AND lue = FALSE',
      [userId]
    );
    return result.affectedRows;
  },

  async notifierAdmins({ titre, message, type, rdv_id }) {
    const [admins] = await db.promise().execute(
      "SELECT id FROM users WHERE role = 'admin'"
    );
    for (const admin of admins) {
      await this.create({ user_id: admin.id, titre, message, type, rdv_id });
    }
  },
};

module.exports = NotificationModel;
