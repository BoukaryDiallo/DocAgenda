require('dotenv').config();

const mysql = require('mysql2');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function setup() {
  const raw = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });
  const conn = raw.promise();

  console.log('MySQL ok');

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await conn.query(`USE \`${DB_NAME}\``);
  console.log(`Database "${DB_NAME}" prête`);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      prenom VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      telephone VARCHAR(20),
      password VARCHAR(255) NOT NULL,
      role ENUM('patient', 'admin') DEFAULT 'patient',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table "users" ok');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS medecins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      specialite VARCHAR(100) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table "medecins" ok');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS disponibilites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      medecin_id INT NOT NULL,
      jour ENUM('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche') NOT NULL,
      heure_debut TIME NOT NULL,
      heure_fin TIME NOT NULL,
      FOREIGN KEY (medecin_id) REFERENCES medecins(id) ON DELETE CASCADE
    )
  `);
  console.log('Table "disponibilites" ok');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS rendez_vous (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      medecin_id INT NOT NULL,
      date_rdv DATE NOT NULL,
      heure_rdv TIME NOT NULL,
      statut ENUM('en_attente','confirme','annule') DEFAULT 'en_attente',
      motif VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (medecin_id) REFERENCES medecins(id) ON DELETE CASCADE
    )
  `);
  console.log('Table "rendez_vous" ok');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      titre VARCHAR(100) NOT NULL,
      message VARCHAR(255) NOT NULL,
      type ENUM('creation','confirmation','annulation') NOT NULL,
      rdv_id INT,
      lue BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (rdv_id) REFERENCES rendez_vous(id) ON DELETE SET NULL
    )
  `);
  console.log('Table "notifications" ok');

  const [admins] = await conn.query("SELECT COUNT(*) as total FROM users WHERE role = 'admin'");
  if (admins[0].total === 0) {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);
    await conn.query(
      'INSERT INTO users (nom, prenom, email, telephone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['Admin', 'DocAgenda', 'admin@docagenda.com', '70000000', hash, 'admin']
    );
    console.log('Admin créé (admin@docagenda.com / admin123)');
  }

  const [meds] = await conn.query('SELECT COUNT(*) as total FROM medecins');
  if (meds[0].total === 0) {
    await conn.query(`
      INSERT INTO medecins (nom, specialite) VALUES
      ('Dr. Ouedraogo', 'Médecine Générale'),
      ('Dr. Diallo', 'Pédiatrie'),
      ('Dr. Traore', 'Cardiologie'),
      ('Dr. Sawadogo', 'Dermatologie')
    `);
    console.log('Médecins de test insérés');

    await conn.query(`
      INSERT INTO disponibilites (medecin_id, jour, heure_debut, heure_fin) VALUES
      (1, 'lundi', '08:00', '12:00'),
      (1, 'mercredi', '14:00', '18:00'),
      (1, 'vendredi', '08:00', '12:00'),
      (2, 'mardi', '08:00', '12:00'),
      (2, 'jeudi', '08:00', '12:00'),
      (3, 'lundi', '14:00', '18:00'),
      (3, 'mardi', '14:00', '18:00'),
      (3, 'vendredi', '14:00', '18:00'),
      (4, 'mercredi', '08:00', '12:00'),
      (4, 'jeudi', '14:00', '18:00')
    `);
    console.log('Disponibilités de test insérées');
  }

  raw.end();
  console.log('Setup terminé !');
}

setup().catch((err) => {
  console.error('Erreur setup :', err.message);
  process.exit(1);
});
