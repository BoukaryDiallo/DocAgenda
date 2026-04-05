import React, {useState} from 'react';
import {View, ScrollView, Alert, StyleSheet} from 'react-native';
import {ajouterMedecin, modifierMedecin} from '../api';
import ChampTexte from '../components/ChampTexte';
import Bouton from '../components/Bouton';

const FormulaireMedecin = ({route, navigation}) => {
  const medecinExistant = route.params?.medecin;
  const isModification = !!medecinExistant;

  const [nom, setNom] = useState(medecinExistant?.nom || '');
  const [specialite, setSpecialite] = useState(medecinExistant?.specialite || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nom.trim() || !specialite.trim()) {
      Alert.alert('Attention', 'Le nom et la spécialité sont obligatoires');
      return;
    }

    const medecin = {
      nom: nom.trim(),
      specialite: specialite.trim(),
    };

    setSubmitting(true);
    try {
      if (isModification) {
        await modifierMedecin(medecinExistant.id, medecin);
        Alert.alert('Succès', 'Médecin modifié avec succès');
      } else {
        await ajouterMedecin(medecin);
        Alert.alert('Succès', 'Médecin ajouté avec succès');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <ChampTexte
          label="Nom *"
          value={nom}
          onChangeText={setNom}
          placeholder="Dr. Nom"
        />
        <ChampTexte
          label="Spécialité *"
          value={specialite}
          onChangeText={setSpecialite}
          placeholder="Médecine Générale"
        />
        <Bouton
          titre={submitting ? 'Envoi...' : (isModification ? 'Enregistrer' : 'Ajouter')}
          onPress={submitting ? undefined : handleSubmit}
          style={{marginTop: 32}}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  form: {
    margin: 16,
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    padding: 20,
  },
});

export default FormulaireMedecin;
