import React, {useState} from 'react';
import {View, Text, ScrollView, Alert, StyleSheet} from 'react-native';
import {useAuthContext} from '../contexts/AuthContext';
import ChampTexte from '../components/ChampTexte';
import Bouton from '../components/Bouton';

const Inscription = ({navigation}) => {
  const {inscription} = useAuthContext();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInscription = async () => {
    if (!nom.trim() || !prenom.trim() || !email.trim() || !password) {
      Alert.alert('Attention', 'Nom, prénom, email et mot de passe sont obligatoires');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Attention', 'Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await inscription(nom.trim(), prenom.trim(), email.trim(), telephone.trim(), password);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.titre}>DOC.</Text>
        <Text style={styles.sousTitre}>Crée ton compte patient</Text>
      </View>

      <View style={styles.form}>
        <ChampTexte
          label="Nom *"
          value={nom}
          onChangeText={setNom}
          placeholder="Ton nom"
        />
        <ChampTexte
          label="Prénom *"
          value={prenom}
          onChangeText={setPrenom}
          placeholder="Ton prénom"
        />
        <ChampTexte
          label="Email *"
          value={email}
          onChangeText={setEmail}
          placeholder="ton@email.com"
          keyboardType="email-address"
        />
        <ChampTexte
          label="Téléphone"
          value={telephone}
          onChangeText={setTelephone}
          placeholder="Ton numéro"
          keyboardType="phone-pad"
        />
        <ChampTexte
          label="Mot de passe *"
          value={password}
          onChangeText={setPassword}
          placeholder="6 caractères minimum"
          secureTextEntry
        />
        <Bouton
          titre={loading ? 'Inscription...' : "S'inscrire"}
          onPress={handleInscription}
          style={{marginTop: 32}}
        />
      </View>

      <Bouton
        titre="Déjà un compte ? Se connecter"
        couleur="danger"
        onPress={() => navigation.goBack()}
        style={{marginHorizontal: 16, marginTop: 12}}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 30,
  },
  titre: {
    fontSize: 48,
    fontWeight: '900',
    color: '#e85d4a',
    letterSpacing: 2,
  },
  sousTitre: {
    fontSize: 14,
    color: '#6b6453',
    marginTop: 4,
    letterSpacing: 0.5,
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

export default Inscription;
