import React, { useState } from 'react';
import Constants from 'expo-constants';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const RewardsScreen = ({ user, onAddToCart, onUpdateRewards, cart = [] }) => {
  const [activeSection, setActiveSection] = useState('food');
  const API_BACKEND_URL = Constants.expoConfig.extra.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  // Food rewards
  const foodRewards = [
    { id: 'food-1', name: 'Free Jerk Chicken', description: 'Traditional Jamaican jerk chicken', points: 100, category: 'food' },
    { id: 'food-2', name: 'Free Curry Goat', description: 'Slow-cooked goat in rich curry', points: 150, category: 'food' },
    { id: 'food-3', name: 'Free Escovitch Fish', description: 'Crispy fried fish with pickled vegetables', points: 120, category: 'food' },
    { id: 'food-4', name: 'Free Ackee & Saltfish', description: 'Jamaican national dish', points: 180, category: 'food' },
  ];

  // Merchandise rewards
  const merchRewards = [
    { id: 'merch-1', name: 'Caribbean Spice Set', description: 'Authentic Jamaican spices collection', points: 200, category: 'merch' },
    { id: 'merch-2', name: 'Taste of Caribbean T-Shirt', description: 'Premium cotton t-shirt with logo', points: 250, category: 'merch' },
    { id: 'merch-3', name: 'Recipe Book', description: 'Traditional Caribbean recipes', points: 300, category: 'merch' },
    { id: 'merch-4', name: 'Caribbean Coffee Mug', description: 'Ceramic mug with island design', points: 80, category: 'merch' },
  ];

  // Handle reward redemption
  const handleRedeemReward = async (reward) => {
    const currentPoints = user?.loyaltyPoints || 0;

    if (!user) {
      Alert.alert('Not signed in', 'Please sign in to redeem rewards.');
      return;
    }

    if (currentPoints < reward.points) {
      Alert.alert('Insufficient Points', `You need ${reward.points} points to redeem ${reward.name}. You have ${currentPoints} points.`);
      return;
    }

    // Try redeeming via server API. Adjust the base URL as needed for emulator/device.
    try {
      const res = await fetch(`${API_BACKEND_URL}/api/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, points: reward.points })
      });

      // Safely read response body: avoid throwing on empty/non-JSON responses
      const text = await res.text();
      let json = null;
      if (text) {
        try {
          json = JSON.parse(text);
        } catch (e) {
          // ignore parse error and keep json as null
          json = null;
        }
      }

      if (!res.ok) {
        // Server returned error (e.g., not enough points)
        const msg = (json && json.message) ? json.message : 'Unable to redeem points';
        Alert.alert('Redeem failed', msg);
        return;
      }

      // Success: update client state and add reward to cart
      // Prefer server-provided full user row; fall back to rewards field if present
      const newPoints = (json && json.user && typeof json.user.rewards === 'number')
        ? json.user.rewards
        : (json && typeof json.rewards === 'number')
          ? json.rewards
          : (currentPoints - reward.points);
      if (onUpdateRewards) onUpdateRewards(newPoints);

      // Add the redeemed reward to cart (client-side)
      if (onAddToCart) onAddToCart({ ...reward, quantity: 1 });

      Alert.alert('Item redeemed successfully', `${reward.name} added to cart!`);
    } catch (err) {
      console.error('Redeem error', err);
      // Fallback to client-only behavior if server unavailable
      if (onAddToCart) onAddToCart({ ...reward, quantity: 1 });
      // Use friendly success message for offline case
      Alert.alert('Item redeemed successfully', `${reward.name} added to cart!`);
      if (onUpdateRewards) onUpdateRewards(currentPoints - reward.points);
    }
  };

  const renderRewardCard = (reward) => (
    <TouchableOpacity
      key={reward.id}
      style={[
        styles.rewardCard,
        user && user.loyaltyPoints >= reward.points ? styles.rewardCardAvailable : styles.rewardCardUnavailable
      ]}
      onPress={() => handleRedeemReward(reward)}
    >
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{reward.name}</Text>
        <Text style={styles.rewardDescription}>{reward.description}</Text>
      </View>
      <View style={styles.rewardCost}>
        <Text style={[
          styles.costText,
          user && user.loyaltyPoints >= reward.points ? styles.costTextAvailable : styles.costTextUnavailable
        ]}>
          {reward.points} pts
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>


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

      {/* Section Tabs */}
      <View style={styles.sectionTabs}>
        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'food' && styles.sectionTabActive]}
          onPress={() => setActiveSection('food')}
        >
          <Text style={[styles.sectionTabText, activeSection === 'food' && styles.sectionTabTextActive]}>
            Food
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'merch' && styles.sectionTabActive]}
          onPress={() => setActiveSection('merch')}
        >
          <Text style={[styles.sectionTabText, activeSection === 'merch' && styles.sectionTabTextActive]}>
            Merch
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rewards Content */}
      <ScrollView style={styles.rewardsSection} showsVerticalScrollIndicator={false} contentContainerStyle={styles.rewardsContent}>
        <Text style={styles.sectionTitle}>
          {activeSection === 'food' ? 'Food Rewards' : 'Merchandise Rewards'}
        </Text>

        {activeSection === 'food'
          ? foodRewards.map(renderRewardCard)
          : merchRewards.map(renderRewardCard)
        }
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
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
  rewardsSection: {
    flex: 1,
  },
  rewardsContent: {
    padding: 16,
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  sectionTabActive: {
    borderBottomColor: '#3498db',
  },
  sectionTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  sectionTabTextActive: {
    color: '#3498db',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  rewardCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  rewardDescription: {
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  rewardCost: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  costText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  costTextAvailable: {
    color: '#fff',
  },
  costTextUnavailable: {
    color: '#bdc3c7',
  },
  rewardCardAvailable: {
    backgroundColor: '#fff',
    opacity: 1,
    borderColor: '#3498db',
    borderWidth: 2,
  },
  rewardCardUnavailable: {
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
    borderColor: '#e9ecef',
    borderWidth: 1,
  },
});

export default RewardsScreen;