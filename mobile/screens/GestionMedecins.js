import React from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import useMedecins from '../hooks/useMedecins';
import CarteMedecin from '../components/CarteMedecin';
import Bouton from '../components/Bouton';
import Chargement from '../components/Chargement';

const GestionMedecins = ({navigation}) => {
  const {medecins, loading, confirmerSuppression} = useMedecins();

  if (loading) {
    return <Chargement />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.compteur}>
        <Text style={styles.compteurNombre}>{medecins.length}</Text>
        <Text style={styles.compteurLabel}>MEDECINS</Text>
      </View>

      {medecins.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.videSymbol}>--</Text>
          <Text style={styles.vide}>Aucun médecin</Text>
        </View>
      ) : (
        <FlatList
          data={medecins}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
          renderItem={({item}) => (
            <CarteMedecin
              medecin={item}
              onPress={() =>
                navigation.navigate('DetailMedecin', {medecin: item})
              }
            />
          )}
        />
      )}

      <View style={styles.footer}>
        <Bouton
          titre="+ Nouveau médecin"
          onPress={() => navigation.navigate('FormulaireMedecin', {})}
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
  footer: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#2a2a4e',
  },
});

export default GestionMedecins;
