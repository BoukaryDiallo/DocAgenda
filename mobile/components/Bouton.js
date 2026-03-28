import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const COULEURS = {
  primaire: {bg: '#e85d4a', text: '#fff'},
  succes: {bg: '#2d6a6a', text: '#f0ead6'},
  danger: {bg: '#1a1a2e', text: '#e85d4a'},
};

const Bouton = ({titre, onPress, couleur = 'primaire', style}) => {
  const theme = COULEURS[couleur];
  return (
    <TouchableOpacity
      style={[
        styles.bouton,
        {backgroundColor: theme.bg},
        couleur === 'danger' && styles.dangerBorder,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={[styles.texte, {color: theme.text}]}>{titre.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bouton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1a1a2e',
  },
  dangerBorder: {
    borderColor: '#e85d4a',
  },
  texte: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

export default Bouton;
