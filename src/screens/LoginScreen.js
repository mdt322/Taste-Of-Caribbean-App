import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { API_BASE_URL } from '../utils/apiConfig';
console.log('API Base URL retrieved by LoginScreen:', API_BASE_URL);
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../config/firebase';

const LoginScreen = ({ setAuthFlag, setAuthMode, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('Logging in...');
      setShowStatus(true);

      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('API URL:', `${API_BASE_URL}/api/auth/login`);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Safely parse response body (avoid throwing on empty/non-JSON)
      const text = await response.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = null;
        }
      }

      console.log('=== LOGIN RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error((data && data.message) ? data.message : 'Login failed');
      }

      setStatusMessage('Login successful!');
      if (onLoginSuccess) {
        // Pass server-provided user object to parent with all necessary fields
        const userData = {
          email: data.user?.email || email,
          name: data.user?.name || email.split('@')[0],
          loyaltyPoints: data.user?.loyaltyPoints || 0,
          isAdmin: (data.user?.email || email) === 'kg539@njit.edu'
        };
        onLoginSuccess(userData);
      }

      // Hide status after 2 seconds and close modal
      setTimeout(() => {
        setShowStatus(false);
        setAuthFlag(false); // Close auth modal after successful login
        setLoading(false);
      }, 1000); // Reduced delay for better UX

    } catch (error) {
      Alert.alert('Login Failed', error.message);
      setShowStatus(false);
      setLoading(false);
    } finally {
      // setLoading(false); // Moved up and into setTimeout()
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

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
    color: '#a1a1a1ff'
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

export default LoginScreen;
