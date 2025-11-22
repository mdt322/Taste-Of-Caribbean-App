import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
console.log('API BASE URL retrieved by RewardsScreen: ', API_BASE_URL);
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../utils/theme';
// Pulls items from collections menu and merch with a point field
// import { useRewards } from '../hooks/useRewards';

const RewardsScreen = ({ user, onAddToCart, onUpdateRewards, cart = [] }) => {
  const [activeSection, setActiveSection] = useState('food');

  // Use instead of separate arrays for food and merch rewards
  // const { rewardItems, loading, error} = useRewards();

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
      const res = await fetch(`${API_BASE_URL}/api/rewards/redeem`, {
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

        {activeSection === 'food' ?
          foodRewards.map(renderRewardCard)
          : merchRewards.map(renderRewardCard)

          // Takes actual items from the database thats in the rewardItems array
          // rewardItems.filter(item => item.reward_type === 'food')
          // : rewardItems.filter(item => item.reward_type === 'merch')
        }
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background.primary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary.turquoise,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary.turquoise,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  pointsDisplay: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary.orange,
  },
  pointsDisplayText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  pointsValue: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary.orange,
  },
  rewardsSection: {
    flex: 1,
  },
  rewardsContent: {
    padding: SPACING.md,
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.primary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary.green,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  sectionTabActive: {
    borderBottomColor: COLORS.primary.green,
  },
  sectionTabText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
  },
  sectionTabTextActive: {
    color: COLORS.primary.green,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary.turquoise,
    marginBottom: SPACING.md,
  },
  rewardCard: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.primary.turquoise,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  rewardDescription: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.sizes.md + 5,
  },
  rewardCost: {
    backgroundColor: COLORS.primary.turquoise,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    minWidth: 80,
    alignItems: 'center',
  },
  costText: {
    color: COLORS.text.white,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  costTextAvailable: {
    color: COLORS.text.white,
  },
  costTextUnavailable: {
    color: '#bdc3c7',
  },
  rewardCardAvailable: {
    backgroundColor: COLORS.background.primary,
    opacity: 1,
    borderColor: COLORS.primary.turquoise,
    borderWidth: 2,
  },
  rewardCardUnavailable: {
    backgroundColor: COLORS.background.secondary,
    opacity: 0.7,
    borderColor: COLORS.border.medium,
    borderWidth: 1,
  },
});

export default RewardsScreen;