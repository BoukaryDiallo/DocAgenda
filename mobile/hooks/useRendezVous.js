import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getMesRendezVous, getTousRendezVous, supprimerRendezVous, changerStatutRDV} from '../api';

const useRendezVous = (mode = 'patient') => {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);

  const charger = async () => {
    try {
      setLoading(true);
      const data = mode === 'admin' ? await getTousRendezVous() : await getMesRendezVous();
      setRendezVous(data);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      charger();
    }, []),
  );

  const supprimer = async id => {
    try {
      await supprimerRendezVous(id);
      await charger();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  const confirmerSuppression = (id) => {
    Alert.alert('Annuler le rendez-vous', 'Confirmer l\'annulation ?', [
      {text: 'Non', style: 'cancel'},
      {text: 'Oui, annuler', style: 'destructive', onPress: () => supprimer(id)},
    ]);
  };

  const changerStatut = async (id, statut) => {
    try {
      await changerStatutRDV(id, statut);
      await charger();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  return {rendezVous, loading, charger, confirmerSuppression, changerStatut};
};

export default useRendezVous;
