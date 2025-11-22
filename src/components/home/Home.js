import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../utils/theme';

const backgroundImage = require('../../../assets/jerk-chicken.jpeg');
const logoImage = require('../../../assets/TOC_Logo.png');

const Home = ({ user, onNavigate, onSignIn }) => {
  const points = user?.loyaltyPoints ?? 0;
  const progress = Math.min((points / 500) * 100, 100);
  const pointsToNext = Math.max(500 - points, 0);

  return (
    <View style={styles.rootContainer}>
      
    
      <View style={styles.headerContainer}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />

        <View style={styles.contactWrapper}>
          <View style={styles.contactBlock}>
            <Text style={styles.contactText}>4 Branford Pl, Newark, NJ 07102</Text>
            <Text style={styles.contactText}>+1 (908) 569-4744</Text>
          </View>
        </View>
      </View>

      {/* ------------------------------ */}
      {/*   PAGE BACKGROUND + CONTENT     */}
      {/* ------------------------------ */}
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollSpacing}
          >

            {/* WELCOME */}
            <View style={styles.section}>
              <Text style={styles.title}>
                {user ? `Welcome back, ${user.name}!` : 'Welcome to Taste of Caribbean'}
              </Text>

              <Text style={styles.subtitle}>
                {user
                  ? 'Here is a quick look at your rewards and updates.'
                  : 'Sign in to start earning loyalty points and view personalized updates.'}
              </Text>
            </View>

            {/* REWARDS SECTION */}
            {user ? (
              <View style={styles.card}>
                <View style={styles.pointsRow}>
                  <Text style={styles.pointsLabel}>Loyalty Points</Text>
                  <Text style={styles.pointsNumber}>{points}</Text>
                </View>

                <Text style={styles.info}>
                  Earn 1 point for every $1 spent.
                </Text>

                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>

                <Text style={styles.rewardText}>
                  {points >= 500
                    ? 'You have a reward available!'
                    : `${pointsToNext} points until your next free meal!`}
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
              <View style={styles.card}>
                <Text style={styles.signInTitle}>Earn Rewards</Text>
                <Text style={styles.info}>
                  Sign in to collect points, redeem offers, and view your order history.
                </Text>

                {onSignIn && (
                  <TouchableOpacity style={styles.primaryButton} onPress={onSignIn}>
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* NEWS */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Latest News</Text>
              <Text style={styles.cardText}>
                Special events, seasonal menu changes, and announcements will appear here.
              </Text>
            </View>

            {/* HISTORY */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Order History</Text>
              <Text style={styles.cardText}>
                Your recent orders will appear here soon.
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

            <View style={{ height: 60 }} />

          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};


const HEADER_HEIGHT = 80; // controls how high the header sits

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.background.header,
    paddingHorizontal: SPACING.sm,
    zIndex: 10,
  },

  logo: {
    width: 60,
    height: 60,
  },

  contactWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  contactBlock: {
    alignItems: 'center',
  },

  contactText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    textAlign: 'center',
  },

  /* ---------- Background Overlay ---------- */
  background: {
    flex: 1,
    marginTop: HEADER_HEIGHT, // pushes content BELOW header
  },

  backgroundImage: {
    opacity: 0.53,
  },

  overlay: {
    flex: 1,
    backgroundColor: COLORS.background.overlay,
  },


  scrollSpacing: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

 
  section: {
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary.turquoise,
    marginBottom: SPACING.sm,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
  },

  card: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary.turquoise,
    marginBottom: SPACING.sm,
  },

  cardText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.sizes.md + 6,
  },

  /* ---------- Rewards ---------- */
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  pointsLabel: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
  },

  pointsNumber: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.primary.orange,
  },

  info: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },

  progressBar: {
    height: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.border.medium,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary.orange,
  },

  rewardText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary.green,
    fontWeight: TYPOGRAPHY.weights.medium,
  },

  /* ---------- Buttons ---------- */
  primaryButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary.turquoise,
    borderRadius: BORDER_RADIUS.md,
  },

  primaryButtonText: {
    color: COLORS.text.white,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },

  secondaryButton: {
    marginTop: SPACING.md,
    borderColor: COLORS.primary.turquoise,
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },

  secondaryButtonText: {
    color: COLORS.primary.turquoise,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});

export default Home;