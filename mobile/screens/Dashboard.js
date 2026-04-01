import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useAuthContext} from '../contexts/AuthContext';
import {getMesRendezVous} from '../api';
import CarteRendezVous from '../components/CarteRendezVous';
import Bouton from '../components/Bouton';
import Chargement from '../components/Chargement';

const Dashboard = ({navigation}) => {
  const {user} = useAuthContext();
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, []),
  );

  const charger = async () => {
    try {
      setLoading(true);
      const data = await getMesRendezVous();
      setRdvs(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const prochains = rdvs.filter(r => r.statut !== 'annule').slice(0, 3);

  if (loading) {
    return <Chargement />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bienvenue}>Bonjour,</Text>
        <Text style={styles.nom}>{user?.prenom || user?.nom}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{rdvs.length}</Text>
          <Text style={styles.statLabel}>TOTAL RDV</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, {color: '#2d6a6a'}]}>
            {rdvs.filter(r => r.statut === 'confirme').length}
          </Text>
          <Text style={styles.statLabel}>CONFIRMES</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, {color: '#e8a94a'}]}>
            {rdvs.filter(r => r.statut === 'en_attente').length}
          </Text>
          <Text style={styles.statLabel}>EN ATTENTE</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PROCHAINS RDV</Text>
      </View>

      {prochains.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.videSymbol}>--</Text>
          <Text style={styles.vide}>Aucun rendez-vous</Text>
        </View>
      ) : (
        <FlatList
          data={prochains}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
          renderItem={({item}) => (
            <CarteRendezVous
              rdv={item}
              onPress={() => navigation.navigate('RDVTab', {
                screen: 'DetailRendezVous',
                params: {rdv: item},
              })}
            />
          )}
        />
      )}

      <View style={styles.footer}>
        <Bouton
          titre="+ Prendre rendez-vous"
          onPress={() => navigation.navigate('MedecinsTab', {
            screen: 'ListeMedecins',
          })}
        />
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
    paddingBottom: 16,
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#e85d4a',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6b6453',
    letterSpacing: 1,
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6b6453',
    letterSpacing: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videSymbol: {
    fontSize: 40,
    color: '#3a3a5e',
    fontWeight: '900',
    marginBottom: 8,
  },
  vide: {
    fontSize: 14,
    color: '#6b6453',
    letterSpacing: 0.5,
  },
  footer: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#2a2a4e',
  },
});

export default Dashboard;
