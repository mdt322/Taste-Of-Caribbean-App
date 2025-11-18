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

        <View style={styles.contactBlock}>
          <Text style={styles.contactText}>Taste of the Caribbean</Text>
          <Text style={styles.contactText}>4 Branford Pl, Newark, NJ 07102</Text>
          <Text style={styles.contactText}>Phone: (555) 123-4567</Text>
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


const HEADER_HEIGHT = 165; // controls how high the header sits

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingTop: 15,
    paddingHorizontal: 12,
    paddingBottom: 10,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },

  logo: {
    width: 170,
    height: 95,
    marginBottom: 4,
  },

  contactBlock: {
    alignItems: 'center',
  },

  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
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
    backgroundColor: 'rgba(255,255,255,0.78)',
  },


  scrollSpacing: {
    paddingHorizontal: 20,
    paddingTop: 20, // content starts cleanly below header
    paddingBottom: 40,
  },

 
  section: {
    marginBottom: 18,
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
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },

  /* ---------- Rewards ---------- */
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  pointsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },

  pointsNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffb300',
  },

  info: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },

  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9ecef',
    overflow: 'hidden',
    marginBottom: 10,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#ffb300',
  },

  rewardText: {
    fontSize: 13,
    color: '#28a745',
    fontWeight: '600',
  },

  /* ---------- Buttons ---------- */
  primaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    marginTop: 14,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  secondaryButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;
