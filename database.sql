-- Création de la base de données
CREATE DATABASE IF NOT EXISTS studmanager;

USE studmanager;

-- Création de la table students
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  age INT,
  telephone VARCHAR(20),
  sexe VARCHAR(10),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table users pour l'authentification
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quelques données de test
INSERT INTO students (nom, prenom, age, telephone, sexe) VALUES
('Diallo', 'Amadou', 22, '70123456', 'Masculin'),
('Traore', 'Fatoumata', 20, '76543210', 'Feminin'),
('Ouedraogo', 'Ibrahim', 24, '71112233', 'Masculin');
