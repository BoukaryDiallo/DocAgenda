import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getMedecins, supprimerMedecin} from '../api';

const useMedecins = () => {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);

  const charger = async () => {
    try {
      setLoading(true);
      const data = await getMedecins();
      setMedecins(data);
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
      await supprimerMedecin(id);
      await charger();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    }
  };

  const confirmerSuppression = (id, nom) => {
    Alert.alert('Supprimer', `Supprimer ${nom} ?`, [
      {text: 'Annuler', style: 'cancel'},
      {text: 'Supprimer', style: 'destructive', onPress: () => supprimer(id)},
    ]);
  };

  return {medecins, loading, charger, confirmerSuppression};
};

export default useMedecins;
