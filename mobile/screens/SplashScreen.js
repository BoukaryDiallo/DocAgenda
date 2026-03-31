import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SplashScreen = ({onFinish}) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DOC.</Text>
      <Text style={styles.subtitle}>AGENDA</Text>
      <Text style={styles.tagline}>Gestion de rendez-vous</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 72,
    fontWeight: '900',
    color: '#e85d4a',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#f0ead6',
    letterSpacing: 8,
    marginTop: -4,
  },
  tagline: {
    fontSize: 12,
    color: '#6b6453',
    marginTop: 16,
    letterSpacing: 1,
  },
});

export default SplashScreen;
