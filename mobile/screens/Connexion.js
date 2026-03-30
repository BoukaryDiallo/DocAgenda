import React, {useState} from 'react';
import {View, Text, ScrollView, Alert, StyleSheet} from 'react-native';
import {useAuthContext} from '../contexts/AuthContext';
import ChampTexte from '../components/ChampTexte';
import Bouton from '../components/Bouton';

const Connexion = ({navigation}) => {
  const {connexion} = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnexion = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Attention', 'Remplis tous les champs');
      return;
    }

    setLoading(true);
    try {
      await connexion(email.trim(), password);
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
        <Text style={styles.sousTitre}>Connecte-toi pour continuer</Text>
      </View>

      <View style={styles.form}>
        <ChampTexte
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="ton@email.com"
          keyboardType="email-address"
        />
        <ChampTexte
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••"
          secureTextEntry
        />
        <Bouton
          titre={loading ? 'Connexion...' : 'Se connecter'}
          onPress={handleConnexion}
          style={{marginTop: 32}}
        />
      </View>

      <Bouton
        titre="Créer un compte"
        couleur="danger"
        onPress={() => navigation.navigate('Inscription')}
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

export default Connexion;
