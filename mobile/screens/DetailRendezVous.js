import React, {useState, useEffect} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {getRendezVous, supprimerRendezVous} from '../api';
import LigneInfo from '../components/LigneInfo';
import Bouton from '../components/Bouton';
import Chargement from '../components/Chargement';

const STATUT_COLORS = {
  en_attente: {bg: '#e8a94a', text: '#1a1a2e', label: 'EN ATTENTE'},
  confirme: {bg: '#2d6a6a', text: '#f0ead6', label: 'CONFIRMÉ'},
  annule: {bg: '#e85d4a', text: '#fff', label: 'ANNULÉ'},
};

const DetailRendezVous = ({route, navigation}) => {
  const rdvParam = route.params?.rdv;
  const [rdv, setRdv] = useState(rdvParam || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rdvParam) {
      setLoading(false);
      return;
    }
    charger();
  }, []);

  const charger = async () => {
    try {
      const data = await getRendezVous(rdvParam.id);
      setRdv(data);
    } catch {
      // fallback sur les params
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Chargement />;
  }

  if (!rdv) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#6b6453', fontSize: 14}}>Rendez-vous non trouvé</Text>
        </View>
      </View>
    );
  }

  const statut = STATUT_COLORS[rdv.statut] || STATUT_COLORS.en_attente;

  const formatDate = dateStr => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatHeure = heureStr => (heureStr ? heureStr.substring(0, 5) : '');

  const handleAnnuler = () => {
    Alert.alert('Annuler le rendez-vous', 'Confirmer l\'annulation ?', [
      {text: 'Non', style: 'cancel'},
      {
        text: 'Oui, annuler',
        style: 'destructive',
        onPress: async () => {
          try {
            await supprimerRendezVous(rdv.id);
            Alert.alert('Succès', 'Rendez-vous annulé');
            navigation.goBack();
          } catch (err) {
            Alert.alert('Erreur', err.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.medecinNom}>{rdv.medecin_nom}</Text>
        {rdv.specialite && (
          <Text style={styles.specialite}>{rdv.specialite}</Text>
        )}
        <View style={[styles.badge, {backgroundColor: statut.bg}]}>
          <Text style={[styles.badgeText, {color: statut.text}]}>
            {statut.label}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <LigneInfo label="Date" valeur={formatDate(rdv.date_rdv)} />
        <LigneInfo label="Heure" valeur={formatHeure(rdv.heure_rdv)} />
        {rdv.motif && <LigneInfo label="Motif" valeur={rdv.motif} />}
        <LigneInfo label="Statut" valeur={statut.label} />
      </View>

      {rdv.statut !== 'annule' && (
        <View style={styles.footer}>
          <Bouton
            titre="Annuler le rendez-vous"
            couleur="danger"
            onPress={handleAnnuler}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    backgroundColor: '#f0ead6',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1a1a2e',
  },
  medecinNom: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  specialite: {
    fontSize: 14,
    color: '#6b6453',
    marginTop: 4,
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
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

export default DetailRendezVous;
