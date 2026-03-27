require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/medecins', require('./routes/medecins'));
app.use('/api/rendez-vous', require('./routes/rendezVous'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/disponibilites', require('./routes/disponibilites'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.json({ message: 'API DocAgenda fonctionne !' });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  const message = process.env.NODE_ENV === 'production'
    ? 'Erreur serveur'
    : err.message || 'Erreur serveur';
  res.status(500).json({ message });
});

app.listen(PORT, () => {
  console.log(`DocAgenda API running on http://localhost:${PORT}`);
});
