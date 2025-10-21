import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

const Profile = ({ user, setAuthFlag, setAuthMode, onLogout }) => {
    const setToRegister = () => {
        setAuthFlag(true);
        setAuthMode('Register');
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: onLogout
                }
            ]
        );
    };

    if (user) {
        // Logged in user profile
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header with user info */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <Text style={styles.memberSince}>
                            Member since {user.memberSince}
                        </Text>
                    </View>
                </View>

                {/* Loyalty Points Card */}
                <View style={styles.pointsCard}>
                    <View style={styles.pointsHeader}>
                        <Text style={styles.pointsTitle}>Loyalty Points</Text>
                        <Text style={styles.pointsValue}>{user.loyaltyPoints}</Text>
                    </View>
                    <Text style={styles.pointsDescription}>
                        Earn points with every order! 1 point per $1 spent.
                    </Text>
                    <View style={styles.pointsProgress}>
                        <View
                            style={[
                                styles.pointsProgressBar,
                                { width: `${Math.min((user.loyaltyPoints / 500) * 100, 100)}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.pointsNextReward}>
                        {500 - user.loyaltyPoints} points until your next free meal!
                    </Text>
                </View>

                {/* Account Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{user.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Member Since</Text>
                            <Text style={styles.infoValue}>{user.memberSince}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Account Status</Text>
                            <Text style={[styles.infoValue, styles.statusActive]}>Active</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={styles.actionCard}>
                            <Text style={styles.actionIcon}>📋</Text>
                            <Text style={styles.actionText}>Order History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Text style={styles.actionIcon}>🎁</Text>
                            <Text style={styles.actionText}>Rewards</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Text style={styles.actionIcon}>❤️</Text>
                            <Text style={styles.actionText}>Favorites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <Text style={styles.actionIcon}>⚙️</Text>
                            <Text style={styles.actionText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        );
    }

    // Not logged in view
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerNotLoggedIn}>
                <Text style={styles.title}>Welcome to Taste of Caribbean</Text>
                <Text style={styles.subtitle}>Sign in to access your profile and earn rewards!</Text>
            </View>

            {/* Features Card */}
            <View style={styles.featuresCard}>
                <Text style={styles.featuresTitle}>Why create an account?</Text>
                <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureIcon}>🏆</Text>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Earn Loyalty Points</Text>
                            <Text style={styles.featureDescription}>
                                Get points on every order and redeem them for free meals
                            </Text>
                        </View>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureIcon}>📱</Text>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Fast Checkout</Text>
                            <Text style={styles.featureDescription}>
                                Save your information for quicker ordering
                            </Text>
                        </View>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureIcon}>🍽️</Text>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Order History</Text>
                            <Text style={styles.featureDescription}>
                                Track your favorite orders and reorder easily
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.signInButton]}
                    onPress={() => setAuthFlag(true)}
                >
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.registerPrompt}>
                    <Text style={styles.registerPromptText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={setToRegister}>
                        <Text style={styles.registerLinkText}>Create one now!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Common styles
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: 20,
    },
    bottomSpacing: {
        height: 50,
    },

    // Logged in user styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 2,
    },
    memberSince: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: '500',
    },

    // Points card
    pointsCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffb300',
    },
    pointsDescription: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 16,
    },
    pointsProgress: {
        height: 8,
        backgroundColor: '#e9ecef',
        borderRadius: 4,
        marginBottom: 8,
    },
    pointsProgressBar: {
        height: '100%',
        backgroundColor: '#ffb300',
        borderRadius: 4,
    },
    pointsNextReward: {
        fontSize: 12,
        color: '#28a745',
        fontWeight: '500',
    },

    // Section styles
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
    },

    // Info card
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    infoLabel: {
        fontSize: 16,
        color: '#6c757d',
    },
    infoValue: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '500',
    },
    statusActive: {
        color: '#28a745',
    },

    // Actions grid
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        textAlign: 'center',
    },

    // Logout button
    logoutButton: {
        backgroundColor: '#dc3545',
        marginHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Not logged in styles
    headerNotLoggedIn: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Features card
    featuresCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featuresTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 16,
    },
    featureList: {
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 12,
        marginTop: 2,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
    },

    // Actions container
    actionsContainer: {
        padding: 16,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    signInButton: {
        backgroundColor: '#3498db',
    },

    // Register prompt
    registerPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerPromptText: {
        fontSize: 16,
        color: '#6c757d',
    },
    registerLinkText: {
        fontSize: 16,
        color: '#3498db',
        fontWeight: '600',
    },
});

export default Profile;