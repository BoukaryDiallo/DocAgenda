import React from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import useRendezVous from '../hooks/useRendezVous';
import CarteRendezVous from '../components/CarteRendezVous';
import Chargement from '../components/Chargement';

const MesRendezVous = ({navigation}) => {
  const {rendezVous, loading} = useRendezVous('patient');

  if (loading) {
    return <Chargement />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.compteur}>
        <Text style={styles.compteurNombre}>{rendezVous.length}</Text>
        <Text style={styles.compteurLabel}>RENDEZ-VOUS</Text>
      </View>

      {rendezVous.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.videSymbol}>--</Text>
          <Text style={styles.vide}>Aucun rendez-vous</Text>
        </View>
      ) : (
        <FlatList
          data={rendezVous}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
          renderItem={({item}) => (
            <CarteRendezVous
              rdv={item}
              onPress={() => navigation.navigate('DetailRendezVous', {rdv: item})}
            />
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
});

export default MesRendezVous;
