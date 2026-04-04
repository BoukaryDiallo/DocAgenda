import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import useRendezVous from '../hooks/useRendezVous';
import CarteRendezVous from '../components/CarteRendezVous';
import Chargement from '../components/Chargement';

const FILTRES = [
  {key: 'tous', label: 'TOUS'},
  {key: 'en_attente', label: 'EN ATTENTE'},
  {key: 'confirme', label: 'CONFIRMÉS'},
  {key: 'annule', label: 'ANNULÉS'},
];

const GestionRendezVous = () => {
  const {rendezVous, loading, changerStatut} = useRendezVous('admin');
  const [filtre, setFiltre] = useState('tous');

  const rdvFiltres = filtre === 'tous'
    ? rendezVous
    : rendezVous.filter(r => r.statut === filtre);

  const handleAction = rdv => {
    const options = [];

    if (rdv.statut === 'en_attente') {
      options.push({
        text: 'Confirmer',
        onPress: () => changerStatut(rdv.id, 'confirme'),
      });
      options.push({
        text: 'Refuser',
        style: 'destructive',
        onPress: () => changerStatut(rdv.id, 'annule'),
      });
    } else if (rdv.statut === 'confirme') {
      options.push({
        text: 'Annuler',
        style: 'destructive',
        onPress: () => changerStatut(rdv.id, 'annule'),
      });
      options.push({
        text: 'Remettre en attente',
        onPress: () => changerStatut(rdv.id, 'en_attente'),
      });
    } else if (rdv.statut === 'annule') {
      options.push({
        text: 'Remettre en attente',
        onPress: () => changerStatut(rdv.id, 'en_attente'),
      });
    }

    options.push({text: 'Fermer', style: 'cancel'});

    const formatDate = new Date(rdv.date_rdv).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });

    Alert.alert(
      `${rdv.patient_prenom} ${rdv.patient_nom}`,
      `${rdv.medecin_nom}\n${formatDate} à ${rdv.heure_rdv?.substring(0, 5)}`,
      options,
    );
  };

  if (loading) {
    return <Chargement />;
  }

  const nbAttente = rendezVous.filter(r => r.statut === 'en_attente').length;

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{rendezVous.length}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, {color: '#e8a94a'}]}>{nbAttente}</Text>
          <Text style={styles.statLabel}>EN ATTENTE</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, {color: '#2d6a6a'}]}>
            {rendezVous.filter(r => r.statut === 'confirme').length}
          </Text>
          <Text style={styles.statLabel}>CONFIRMÉS</Text>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTRES}
        keyExtractor={item => item.key}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 12}}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.filtreBtn,
              filtre === item.key && styles.filtreBtnActive,
            ]}
            onPress={() => setFiltre(item.key)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filtreTxt,
                filtre === item.key && styles.filtreTxtActive,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {rdvFiltres.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.videSymbol}>--</Text>
          <Text style={styles.vide}>Aucun rendez-vous</Text>
        </View>
      ) : (
        <FlatList
          data={rdvFiltres}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16}}
          renderItem={({item}) => (
            <CarteRendezVous
              rdv={item}
              showPatient
              onPress={() => handleAction(item)}
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#e85d4a',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#6b6453',
    letterSpacing: 1,
    marginTop: 2,
  },

  filtreBtn: {
    backgroundColor: '#2a2a4e',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filtreBtnActive: {
    backgroundColor: '#e85d4a',
  },
  filtreTxt: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6b6453',
    letterSpacing: 1,
  },
  filtreTxtActive: {
    color: '#fff',
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

export default GestionRendezVous;
