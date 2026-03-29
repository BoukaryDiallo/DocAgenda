import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login as apiLogin, register as apiRegister, getProfile} from '../api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifierToken();
  }, []);

  const verifierToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const profil = await getProfile();
        setUser(profil);
      }
    } catch {
      await AsyncStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const connexion = async (email, password) => {
    const data = await apiLogin(email, password);
    await AsyncStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const inscription = async (nom, prenom, email, telephone, password) => {
    const data = await apiRegister(nom, prenom, email, telephone, password);
    await AsyncStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const deconnexion = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return {user, loading, connexion, inscription, deconnexion};
};

export default useAuth;
