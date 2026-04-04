import React, {useState, useCallback} from 'react';
import {View, FlatList, Text, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getPatients, supprimerPatient} from '../api';
import Chargement from '../components/Chargement';

const GestionPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, []),
  );

  const charger = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmerSuppression = (id, nom, prenom) => {
    Alert.alert('Supprimer', `Supprimer ${prenom} ${nom} ?`, [
      {text: 'Annuler', style: 'cancel'},
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await supprimerPatient(id);
            await charger();
          } catch (err) {
            Alert.alert('Erreur', err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <Chargement />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.compteur}>
        <Text style={styles.compteurNombre}>{patients.length}</Text>
        <Text style={styles.compteurLabel}>PATIENTS</Text>
      </View>

      {patients.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.videSymbol}>--</Text>
          <Text style={styles.vide}>Aucun patient inscrit</Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
          renderItem={({item}) => (
            <View style={styles.carte}>
              <View style={styles.accent} />
              <View style={styles.contenu}>
                <View style={{flex: 1}}>
                  <Text style={styles.nom}>{item.prenom} {item.nom}</Text>
                  <Text style={styles.info}>{item.email}</Text>
                  {item.telephone && (
                    <Text style={styles.info}>{item.telephone}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.btnSupprimer}
                  onPress={() => confirmerSuppression(item.id, item.nom, item.prenom)}
                  activeOpacity={0.7}>
                  <Text style={styles.btnSupprimerText}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  compteur: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 8,
  },
  compteurNombre: {
    fontSize: 42,
    fontWeight: '900',
    color: '#e85d4a',
  },
  compteurLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b6453',
    letterSpacing: 3,
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
  carte: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 6,
    backgroundColor: '#e85d4a',
  },
  contenu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  nom: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  info: {
    fontSize: 12,
    color: '#6b6453',
    marginTop: 2,
    fontWeight: '600',
  },
  btnSupprimer: {
    backgroundColor: '#1a1a2e',
    width: 34,
    height: 34,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSupprimerText: {
    color: '#e85d4a',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default GestionPatients;
