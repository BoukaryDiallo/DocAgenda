import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useAuthContext} from '../contexts/AuthContext';
import {getTousRendezVous, getPatients, getMedecins} from '../api';

const AdminDashboard = ({navigation}) => {
  const {user} = useAuthContext();
  const [stats, setStats] = useState({rdvs: 0, patients: 0, medecins: 0, enAttente: 0});

  useFocusEffect(
    useCallback(() => {
      charger();
    }, []),
  );

  const charger = async () => {
    try {
      const [rdvs, patients, medecins] = await Promise.all([
        getTousRendezVous(),
        getPatients(),
        getMedecins(),
      ]);
      setStats({
        rdvs: rdvs.length,
        patients: patients.length,
        medecins: medecins.length,
        enAttente: rdvs.filter(r => r.statut === 'en_attente').length,
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bienvenue}>Administration</Text>
        <Text style={styles.nom}>{user?.prenom || user?.nom}</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('GestionRDVTab')}
          activeOpacity={0.8}>
          <Text style={styles.cardNumber}>{stats.rdvs}</Text>
          <Text style={styles.cardLabel}>RENDEZ-VOUS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('GestionRDVTab')}
          activeOpacity={0.8}>
          <Text style={[styles.cardNumber, {color: '#e8a94a'}]}>{stats.enAttente}</Text>
          <Text style={styles.cardLabel}>EN ATTENTE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AdminMedecinsTab')}
          activeOpacity={0.8}>
          <Text style={[styles.cardNumber, {color: '#2d6a6a'}]}>{stats.medecins}</Text>
          <Text style={styles.cardLabel}>MEDECINS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PatientsTab')}
          activeOpacity={0.8}>
          <Text style={[styles.cardNumber, {color: '#f0ead6'}]}>{stats.patients}</Text>
          <Text style={styles.cardLabel}>PATIENTS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  bienvenue: {
    fontSize: 14,
    color: '#6b6453',
    letterSpacing: 0.5,
  },
  nom: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f0ead6',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  card: {
    width: '47%',
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    padding: 24,
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: '#e85d4a',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6b6453',
    letterSpacing: 2,
    marginTop: 6,
  },
});

export default AdminDashboard;
