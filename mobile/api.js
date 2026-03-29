import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.116:3000/api';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

const authHeaders = async () => {
  const token = await getToken();
  const headers = {'Content-Type': 'application/json'};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async response => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur serveur');
  }
  return data;
};




export const register = async (nom, prenom, email, telephone, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({nom, prenom, email, telephone, password}),
  });
  return await handleResponse(response);
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });
  return await handleResponse(response);
};

export const getProfile = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/auth/me`, {headers});
  return await handleResponse(response);
};




export const getMedecins = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/medecins`, {headers});
  return await handleResponse(response);
};

export const getMedecin = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/medecins/${id}`, {headers});
  return await handleResponse(response);
};

export const ajouterMedecin = async medecin => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/medecins`, {
    method: 'POST',
    headers,
    body: JSON.stringify(medecin),
  });
  return await handleResponse(response);
};

export const modifierMedecin = async (id, medecin) => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/medecins/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(medecin),
  });
  return await handleResponse(response);
};

export const supprimerMedecin = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/medecins/${id}`, {
    method: 'DELETE',
    headers,
  });
  return await handleResponse(response);
};




export const getDisponibilites = async medecinId => {
  const headers = await authHeaders();
  const response = await fetch(
    `${API_URL}/medecins/${medecinId}/disponibilites`,
    {headers},
  );
  return await handleResponse(response);
};

export const getCreneaux = async (medecinId, date) => {
  const headers = await authHeaders();
  const response = await fetch(
    `${API_URL}/medecins/${medecinId}/creneaux?date=${date}`,
    {headers},
  );
  return await handleResponse(response);
};

export const ajouterDisponibilite = async (medecinId, dispo) => {
  const headers = await authHeaders();
  const response = await fetch(
    `${API_URL}/medecins/${medecinId}/disponibilites`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(dispo),
    },
  );
  return await handleResponse(response);
};

export const supprimerDisponibilite = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/disponibilites/${id}`, {
    method: 'DELETE',
    headers,
  });
  return await handleResponse(response);
};




export const creerRendezVous = async rdv => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/rendez-vous`, {
    method: 'POST',
    headers,
    body: JSON.stringify(rdv),
  });
  return await handleResponse(response);
};

export const getMesRendezVous = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/rendez-vous/mes-rdv`, {headers});
  return await handleResponse(response);
};

export const getTousRendezVous = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/rendez-vous`, {headers});
  return await handleResponse(response);
};

export const getRendezVous = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/rendez-vous/${id}`, {headers});
  return await handleResponse(response);
};

export const changerStatutRDV = async (id, statut) => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/rendez-vous/${id}/statut`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({statut}),
  });
  return await handleResponse(response);
};

export const supprimerRendezVous = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/rendez-vous/${id}`, {
    method: 'DELETE',
    headers,
  });
  return await handleResponse(response);
};




export const getPatients = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/patients`, {headers});
  return await handleResponse(response);
};

export const getPatient = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/patients/${id}`, {headers});
  return await handleResponse(response);
};

export const supprimerPatient = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/patients/${id}`, {
    method: 'DELETE',
    headers,
  });
  return await handleResponse(response);
};




export const getNotifications = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/notifications`, {headers});
  return await handleResponse(response);
};

export const getNotificationsCount = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/notifications/count`, {headers});
  return await handleResponse(response);
};

export const marquerNotificationLue = async id => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/notifications/${id}/lire`, {
    method: 'PUT',
    headers,
  });
  return await handleResponse(response);
};

export const marquerToutesNotificationsLues = async () => {
  const headers = await authHeaders();
  const response = await fetch(`${API_URL}/notifications/lire-tout`, {
    method: 'PUT',
    headers,
  });
  return await handleResponse(response);
};
