const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

function genererToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

const AuthController = {
  async register(req, res) {
    const { nom, prenom, email, telephone, password } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: 'Nom, prénom, email et mot de passe sont obligatoires' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' });
    }

    try {
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé' });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ nom, prenom, email, telephone, password: hash });
      const token = genererToken(user);

      res.status(201).json({ token, user: { id: user.id, nom, prenom, email, telephone, role: user.role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = genererToken(user);
      res.json({
        token,
        user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },
};

module.exports = AuthController;
