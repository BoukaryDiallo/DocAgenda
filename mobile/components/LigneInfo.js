import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const LigneInfo = ({label, valeur}) => {
  return (
    <View style={styles.ligne}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.valeur}>{valeur}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#e6dfc9',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9a9480',
    letterSpacing: 2,
  },
  valeur: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
});

export default LigneInfo;
