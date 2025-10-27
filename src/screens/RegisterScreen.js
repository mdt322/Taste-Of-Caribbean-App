import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { auth } from '../config/firebase';

const RegisterScreen = ({ setAuthMode, setAuthFlag, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('Creating account...');
      setShowStatus(true);

      // here we are sending response to rds mysql database
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setStatusMessage('Registration successful!');
      if (onRegisterSuccess) {
        onRegisterSuccess({ name, email }); // Pass user data to parent component
      }

      // Hide status after 2 seconds and close modal
      setTimeout(() => {
        setShowStatus(false);
        setAuthFlag(false); // Close auth modal after successful registration
        setAuthMode('Sign In'); //Sets Authentication Modal to default state
        setLoading(false); // Prevents button from being pressed after successful registration
      }, 2000);


    } catch (error) {
      // setStatusMessage('Registration failed');
      // setTimeout(() => setShowStatus(false), 2000);
      //----------------
      //Code above line is replaced with below, enables editing of fields after network error
      Alert.alert('Registration Failed', error.message);
      setShowStatus(false);
      setLoading(false);
    } finally {
      // setLoading(false); // Moved up and into to setTimeout()
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={[styles.input, loading && styles.inputLoading]}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <TextInput
        style={[styles.input, loading && styles.inputLoading]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        style={[styles.input, loading && styles.inputLoading]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={[styles.input, loading && styles.inputLoading]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => navigation.navigate('Login')}
        onPress={() => setAuthMode('Sign In')}
        disabled={loading}
      >
        <Text style={styles.linkText}>
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>

      {/* Status Indicator */}
      {showStatus && (
        <View style={[
          styles.statusIndicator,
          statusMessage.includes('successful') && styles.statusSuccess
        ]}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}
    </View>
  );
};

// Reusing the same styles from LoginScreen
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
    color: '#000000',
    backgroundColor: '#f9f9f9',
  },
  inputLoading: {
    color: '#a1a1a1ff',
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
  buttonCreateAccount: {
    backgroundColor: '#13962fff',
  },
  linkText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: 'rgba(40, 167, 69, 0.9)',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;
