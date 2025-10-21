import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../config/firebase';

const LoginScreen = ({ setAuthFlag, setAuthMode, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      // Simulate successful login (replace with actual Firebase auth)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setLoginSuccess(true);
      if (onLoginSuccess) {
        onLoginSuccess(email); // Pass email to parent component
      }
      setAuthFlag(false); // Close auth modal after successful login
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successMessage}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Login Successful!</Text>
          <Text style={styles.successText}>
            Welcome back! You have successfully signed in to your account.
          </Text>
          <TouchableOpacity
            style={styles.successButton}
            onPress={() => setAuthFlag(false)}
          >
            <Text style={styles.successButtonText}>Continue to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.close]} 
        onPress={() => setAuthFlag(false)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          Close
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        // onPress={() => navigation.navigate('Register')}
        onPress={() => setAuthMode('Register')}
        >
        <Text style={styles.linkText}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  close: {
    backgroundColor: '#b1b1b1ff',
  },
  linkText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  successMessage: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#28a745',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  successIcon: {
    fontSize: 48,
    color: '#28a745',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  successButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
