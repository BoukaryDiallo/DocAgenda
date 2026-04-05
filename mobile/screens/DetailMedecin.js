import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getDisponibilites, ajouterDisponibilite, supprimerDisponibilite, supprimerMedecin} from '../api';
import Bouton from '../components/Bouton';
import Chargement from '../components/Chargement';

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const HEURES = [];
for (let h = 7; h <= 18; h++) {
  HEURES.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 18) HEURES.push(`${String(h).padStart(2, '0')}:30`);
}

const DetailMedecin = ({route, navigation}) => {
  const {medecin} = route.params;
  const [dispos, setDispos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [jour, setJour] = useState('lundi');
  const [heureDebut, setHeureDebut] = useState('08:00');
  const [heureFin, setHeureFin] = useState('12:00');

  useFocusEffect(
    useCallback(() => {
      charger();
    }, []),
  );

  const charger = async () => {
    try {
      setLoading(true);
      const data = await getDisponibilites(medecin.id);
      setDispos(data);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAjouterDispo = async () => {
    if (heureDebut >= heureFin) {
      Alert.alert('Attention', "L'heure de début doit être avant l'heure de fin");
      return;
    }

    try {
      await ajouterDisponibilite(medecin.id, {
        jour,
        heure_debut: heureDebut,
        heure_fin: heureFin,
      });
      setShowForm(false);
      await charger();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleSupprimerDispo = (dispoId) => {
    Alert.alert('Supprimer', 'Supprimer cette disponibilité ?', [
      {text: 'Annuler', style: 'cancel'},
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await supprimerDisponibilite(dispoId);
            await charger();
          } catch (err) {
            Alert.alert('Erreur', err.message);
          }
        },
      },
    ]);
  };

  const handleSupprimerMedecin = () => {
    Alert.alert('Supprimer', `Supprimer ${medecin.nom} ?`, [
      {text: 'Annuler', style: 'cancel'},
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await supprimerMedecin(medecin.id);
            navigation.goBack();
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
      <View style={styles.header}>
        <Text style={styles.nom}>{medecin.nom}</Text>
        <Text style={styles.specialite}>{medecin.specialite}</Text>
      </View>

      <View style={styles.actions}>
        <Bouton
          titre="Modifier"
          couleur="succes"
          onPress={() => navigation.navigate('FormulaireMedecin', {medecin})}
          style={{flex: 1}}
        />
        <Bouton
          titre="Supprimer"
          couleur="danger"
          onPress={handleSupprimerMedecin}
          style={{flex: 1}}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>DISPONIBILITÉS</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)} activeOpacity={0.7}>
          <Text style={styles.addBtn}>{showForm ? 'FERMER' : '+ AJOUTER'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formDispo}>
          <Text style={styles.formLabel}>JOUR</Text>
          <ScrollableSelector
            items={JOURS}
            selected={jour}
            onSelect={setJour}
            format={j => j.charAt(0).toUpperCase() + j.slice(1)}
          />

          <Text style={styles.formLabel}>DÉBUT</Text>
          <ScrollableSelector
            items={HEURES}
            selected={heureDebut}
            onSelect={setHeureDebut}
          />

          <Text style={styles.formLabel}>FIN</Text>
          <ScrollableSelector
            items={HEURES}
            selected={heureFin}
            onSelect={setHeureFin}
          />

          <Bouton
            titre="Ajouter la disponibilité"
            onPress={handleAjouterDispo}
            style={{marginTop: 12}}
          />
        </View>
      )}

      {dispos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.videSymbol}>--</Text>
          <Text style={styles.vide}>Aucune disponibilité définie</Text>
        </View>
      ) : (
        <FlatList
          data={dispos}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
          renderItem={({item}) => (
            <View style={styles.dispoCard}>
              <View style={styles.dispoAccent} />
              <View style={styles.dispoContent}>
                <View style={{flex: 1}}>
                  <Text style={styles.dispoJour}>
                    {item.jour.charAt(0).toUpperCase() + item.jour.slice(1)}
                  </Text>
                  <Text style={styles.dispoHeure}>
                    {item.heure_debut.substring(0, 5)} — {item.heure_fin.substring(0, 5)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.btnSupprimer}
                  onPress={() => handleSupprimerDispo(item.id)}
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

const ScrollableSelector = ({items, selected, onSelect, format}) => (
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={items}
    keyExtractor={item => item}
    style={{marginBottom: 12}}
    renderItem={({item}) => (
      <TouchableOpacity
        style={[
          styles.selectorItem,
          selected === item && styles.selectorItemSelected,
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.8}>
        <Text
          style={[
            styles.selectorText,
            selected === item && styles.selectorTextSelected,
          ]}>
          {format ? format(item) : item}
        </Text>
      </TouchableOpacity>
    )}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    backgroundColor: '#f0ead6',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1a1a2e',
  },
  nom: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  specialite: {
    fontSize: 14,
    color: '#6b6453',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6b6453',
    letterSpacing: 2,
  },
  addBtn: {
    fontSize: 12,
    fontWeight: '900',
    color: '#e85d4a',
    letterSpacing: 1,
  },

  formDispo: {
    marginHorizontal: 16,
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6b6453',
    letterSpacing: 2,
    marginBottom: 6,
  },

  selectorItem: {
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#2a2a4e',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 6,
  },
  selectorItemSelected: {
    backgroundColor: '#e85d4a',
    borderColor: '#e85d4a',
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b6453',
  },
  selectorTextSelected: {
    color: '#fff',
  },

  dispoCard: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  dispoAccent: {
    width: 6,
    backgroundColor: '#2d6a6a',
  },
  dispoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dispoJour: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  dispoHeure: {
    fontSize: 13,
    color: '#2d6a6a',
    fontWeight: '700',
    marginTop: 2,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
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

export default DetailMedecin;
