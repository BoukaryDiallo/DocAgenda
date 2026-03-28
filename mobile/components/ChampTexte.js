import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const ChampTexte = ({label, value, onChangeText, placeholder, keyboardType, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9a9480"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        selectionColor="#e85d4a"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1a1a2e',
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0ead6',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a2e',
  },
});

export default ChampTexte;
