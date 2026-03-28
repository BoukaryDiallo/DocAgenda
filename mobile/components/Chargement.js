import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const Chargement = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#e85d4a" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});

export default Chargement;
