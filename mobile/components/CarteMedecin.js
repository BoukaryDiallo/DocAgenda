import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const CarteMedecin = ({medecin, onPress, onSupprimer}) => {
  return (
    <TouchableOpacity style={styles.carte} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.accent} />
      <View style={styles.contenu}>
        <View style={{flex: 1}}>
          <Text style={styles.nom}>{medecin.nom}</Text>
          <Text style={styles.info}>{medecin.specialite}</Text>
        </View>
        {onSupprimer && (
          <TouchableOpacity style={styles.btnSupprimer} onPress={onSupprimer} activeOpacity={0.7}>
            <Text style={styles.btnSupprimerText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  carte: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 6,
    backgroundColor: '#2d6a6a',
  },
  contenu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  nom: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1a1a2e',
  },
  info: {
    fontSize: 13,
    color: '#6b6453',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
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
});

export default CarteMedecin;
