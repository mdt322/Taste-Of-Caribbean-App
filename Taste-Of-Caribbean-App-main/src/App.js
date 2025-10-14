import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Welcome to Taste of Caribbean</Text>
      <Text style={styles.subtitle}>Your Caribbean Food Adventure Starts Here!</Text>
      <Text style={styles.text}>🌴 Loading... 🌴</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    color: '#3498db',
  },
});
