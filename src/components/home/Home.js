/**
 * Home Page
 * 
 * What this file does:
 * - Shows the main page after logging in
 * - Has tabs for Home, Menu, and Rewards
 * - Shows featured dishes of the day
 * - Displays special offers
 * 
 * Components needed:
 * - Navigation tabs
 * - Featured dishes section
 * - Special offers section
 * 
 * Features to add:
 * 1. Welcome message with user's name
 * 2. Navigation tabs (Home/Menu/Rewards)
 * 3. Featured dishes with pictures
 * 4. Special offers of the day
 * 5. Quick order buttons
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

const backgroundImage = require('../../../assets/jerk-chicken.jpeg');

const Home = ({ user, onNavigate, onSignIn }) => {
  const loyaltyPoints = user?.loyaltyPoints ?? 0;
  const progress = Math.min((loyaltyPoints / 500) * 100, 100);
  const pointsToNextReward = Math.max(500 - loyaltyPoints, 0);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {user ? `Welcome back, ${user.name}!` : 'Welcome to Taste of Caribbean'}
            </Text>
            <Text style={styles.subtitle}>
              {user
                ? 'Here is a quick look at your rewards and updates.'
                : 'Sign in to start earning loyalty points and see personalized updates.'}
            </Text>
          </View>

          {user ? (
            <View style={styles.pointsCard}>
              <View style={styles.pointsHeader}>
                <Text style={styles.pointsTitle}>Loyalty Points</Text>
                <Text style={styles.pointsValue}>{loyaltyPoints}</Text>
              </View>
              <Text style={styles.pointsDescription}>
                Earn points with every order! 1 point per $1 spent.
              </Text>
              <View style={styles.pointsProgress}>
                <View style={[styles.pointsProgressBar, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.pointsNextReward}>
                {loyaltyPoints >= 500
                  ? 'You have a reward ready to redeem!'
                  : `${pointsToNextReward} points until your next free meal!`}
              </Text>
              {onNavigate && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => onNavigate('Rewards')}
                >
                  <Text style={styles.secondaryButtonText}>Redeem Rewards</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.signInCard}>
              <Text style={styles.signInTitle}>Earn Loyalty Points</Text>
              <Text style={styles.signInText}>
                Sign in to track your rewards, redeem exclusive offers, and access personalized
                recommendations.
              </Text>
              {onSignIn && (
                <TouchableOpacity style={styles.primaryButton} onPress={onSignIn}>
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.placeholderCard}>
            <Text style={styles.cardTitle}>Latest News</Text>
            <Text style={styles.cardText}>
              Seasonal menus, special events, and announcements will appear here. Check back soon for
              the latest updates!
            </Text>
          </View>

          <View style={styles.placeholderCard}>
            <Text style={styles.cardTitle}>Order History</Text>
            <Text style={styles.cardText}>
              Your recent orders and quick re-order options will live here. This feature is coming
              soon.
            </Text>
            {onNavigate && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => onNavigate('More')}
              >
                <Text style={styles.secondaryButtonText}>View Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.55,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
  },
  pointsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  pointsValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffb300',
  },
  pointsDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  pointsProgress: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9ecef',
    marginBottom: 8,
    overflow: 'hidden',
  },
  pointsProgressBar: {
    height: '100%',
    backgroundColor: '#ffb300',
  },
  pointsNextReward: {
    fontSize: 13,
    color: '#28a745',
    fontWeight: '600',
    marginBottom: 12,
  },
  signInCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  signInText: {
    fontSize: 15,
    color: '#6c757d',
    lineHeight: 21,
  },
  placeholderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  secondaryButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default Home;
