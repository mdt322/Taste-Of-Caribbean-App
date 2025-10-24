import React from 'react';
import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Main RewardsShop Component - Minimal version for testing
const RewardsShop = () => {
  const route = useRoute();
  const { user, onAddToCart } = route.params || {};

  console.log('RewardsShop: route.params:', route.params);
  console.log('RewardsShop: user:', user);
  console.log('RewardsShop: onAddToCart:', !!onAddToCart);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewards Shop</Text>
        <Text style={styles.headerSubtitle}>Redeem your points for delicious rewards!</Text>
      </View>

      {/* Loyalty Points Display */}
      <View style={styles.pointsDisplay}>
        <Text style={styles.pointsDisplayText}>Your Loyalty Points</Text>
        <Text style={styles.pointsValue}>{user?.loyaltyPoints || 0} pts</Text>
      </View>

      {/* Simple content */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>Rewards Coming Soon!</Text>
        <Text style={styles.subtitle}>Check back later for amazing rewards.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  pointsDisplay: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  pointsDisplayText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default RewardsShop;
