import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useAuthContext} from '../contexts/AuthContext';
import {getProfile} from '../api';
import LigneInfo from '../components/LigneInfo';
import Bouton from '../components/Bouton';
import Chargement from '../components/Chargement';

const Profil = () => {
  const {deconnexion} = useAuthContext();
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerProfil();
  }, []);

  const chargerProfil = async () => {
    try {
      const data = await getProfile();
      setProfil(data);
    } catch {
      deconnexion();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Chargement />;
  }

  if (!profil) {
    return null;
  }

  const dateInscription = new Date(profil.created_at).toLocaleDateString(
    'fr-FR',
    {year: 'numeric', month: 'long', day: 'numeric'},
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.initiale}>{profil.prenom?.[0] || profil.nom[0]}</Text>
        <Text style={styles.nom}>{profil.prenom} {profil.nom}</Text>
        <Text style={styles.email}>{profil.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {profil.role === 'admin' ? 'ADMINISTRATEUR' : 'PATIENT'}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <LigneInfo label="Nom" valeur={profil.nom} />
        <LigneInfo label="Prénom" valeur={profil.prenom} />
        <LigneInfo label="Email" valeur={profil.email} />
        {profil.telephone && <LigneInfo label="Téléphone" valeur={profil.telephone} />}
        <LigneInfo label="Inscription" valeur={dateInscription} />
      </View>

      <View style={styles.footer}>
        <Bouton
          titre="Se déconnecter"
          couleur="danger"
          onPress={deconnexion}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#f0ead6',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1a1a2e',
  },
  initiale: {
    fontSize: 36,
    fontWeight: '900',
    color: '#e85d4a',
    letterSpacing: 4,
    marginBottom: 8,
  },
  nom: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  email: {
    fontSize: 14,
    color: '#6b6453',
    marginTop: 4,
  },
  roleBadge: {
    marginTop: 10,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 2,
  },
  roleText: {
    color: '#e85d4a',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  infoSection: {
    backgroundColor: '#f0ead6',
    margin: 16,
    borderRadius: 4,
    padding: 16,
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  footer: {
    padding: 16,
  },
});

export default Profil;
