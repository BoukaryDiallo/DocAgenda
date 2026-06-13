# DocAgenda

Application mobile de gestion de rendez-vous pour un centre de santé, avec authentification JWT et gestion des rôles (Patient / Admin).

## Démo

[Voir la vidéo de démonstration](https://cdn.boukarydiallo.com/docagenda-demo.mp4)

## Stack technique

- **Mobile** : React Native 0.83 (bare, sans Expo)
- **Backend** : Node.js + Express (architecture MVC)
- **Base de données** : MySQL 8.0

## Prérequis

- Node.js >= 20
- Docker (pour MySQL) ou MySQL installé localement
- Android Studio (émulateur ou appareil physique)

## Installation

### 1. Base de données

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Remplir le fichier `.env` :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=docagenda
PORT=3000
JWT_SECRET=a6NmfkjNbwk7WBsf9Knw
```

Créer les tables et les données de test :

```bash
npm run setup-db
```

Lancer le serveur :

```bash
npm run dev
```

L'API tourne sur http://localhost:3000.

### 3. Application mobile

```bash
cd mobile
npm install
```

Modifier `API_URL` dans `mobile/api.js` selon votre environnement :

- Émulateur Android : `http://10.0.2.2:3000/api`
- Appareil physique : `http://<VOTRE_IP>:3000/api`

```bash
npx react-native start
npx react-native run-android
```

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@docagenda.com | admin123 |

Les patients s'inscrivent depuis l'application.

## Fonctionnalités

### Patient

- Inscription / Connexion
- Consulter la liste des médecins et leurs disponibilités
- Prendre un rendez-vous (sélection médecin, date, créneau horaire)
- Consulter et annuler ses rendez-vous
- Recevoir des notifications (création, confirmation, annulation de RDV)

### Admin

- Gérer les médecins (ajout, modification, suppression)
- Définir les disponibilités des médecins
- Gérer les rendez-vous (confirmer, refuser, filtrer par statut)
- Consulter la liste des patients
- Recevoir des notifications (nouveau RDV, annulation par patient)

## API REST

| Ressource | Méthodes | Accès |
|-----------|----------|-------|
| `/api/auth` | POST register, POST login, GET me | Public / Auth |
| `/api/medecins` | GET, GET :id, POST, PUT, DELETE | Auth / Admin |
| `/api/medecins/:id/disponibilites` | GET, POST | Auth / Admin |
| `/api/medecins/:id/creneaux?date=` | GET | Auth |
| `/api/rendez-vous` | POST, GET mes-rdv, GET :id, DELETE | Auth |
| `/api/rendez-vous` (admin) | GET all, PUT :id/statut | Admin |
| `/api/patients` | GET, GET :id, DELETE | Admin |
| `/api/notifications` | GET, GET count, PUT lire-tout, PUT :id/lire | Auth |

## Structure du projet

```
DocAgenda/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── setup-db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── medecinModel.js
│   │   ├── rendezVousModel.js
│   │   └── notificationModel.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── medecinController.js
│   │   ├── rendezVousController.js
│   │   ├── patientController.js
│   │   └── notificationController.js
│   └── routes/
│       ├── auth.js
│       ├── medecins.js
│       ├── rendezVous.js
│       ├── patients.js
│       ├── disponibilites.js
│       └── notifications.js
├── mobile/
│   ├── App.tsx
│   ├── api.js
│   ├── contexts/
│   ├── hooks/
│   ├── components/
│   └── screens/
├── compose.yml
└── README.md
```

## Base de données

```
users          (id, nom, prenom, email, telephone, password, role, created_at)
medecins       (id, nom, specialite, created_at)
disponibilites (id, medecin_id, jour, heure_debut, heure_fin)
rendez_vous    (id, patient_id, medecin_id, date_rdv, heure_rdv, statut, motif, created_at)
notifications  (id, user_id, titre, message, type, rdv_id, lue, created_at)
```
