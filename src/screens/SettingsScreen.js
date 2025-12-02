import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { API_BASE_URL } from '../utils/apiConfig';

const SettingsScreen = ({ user, onBack, onNavigation, toggleTheme, colors, theme }) => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handlePasswordReset = () => {
    setShowPasswordReset(true);
  };

  if (showPasswordReset) {
    return (
      <PasswordResetScreen
        user={user}
        onBack={() => setShowPasswordReset(false)}
        colors={colors}
        theme={theme}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header with Back Button */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={onBack}
        >
          <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text,
        }}>
          Settings
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Account Settings */}
        <View style={{ margin: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
            Account Settings
          </Text>

          <TouchableOpacity style={{
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>👤</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Profile Information
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                Update your personal details
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              padding: 20,
              borderRadius: 12,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handlePasswordReset}
          >
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Reset Password
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                Change your account password
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={{ margin: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
            App Settings
          </Text>

          <TouchableOpacity style={{
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>🔔</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Notifications
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                Manage notification preferences
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              padding: 20,
              borderRadius: 12,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={toggleTheme}
          >
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Theme
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>🌐</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Language
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>English</Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={{ margin: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
            Support
          </Text>

          <TouchableOpacity style={{
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>❓</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Help & Support
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                Get help and contact support
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>📋</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Terms of Service
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                Read our terms and conditions
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 24, marginRight: 16, width: 30, textAlign: 'center', fontWeight: 'bold' }}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
                Privacy Policy
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                Learn about our privacy practices
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: colors.textMuted }}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const PasswordResetScreen = ({ user, onBack, colors, theme }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    // Basic validation
    if (!oldPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match');
      return;
    }

    if (oldPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    // Send request to server to update password 
    setIsLoading(true);
    try {
      const payload = {
        email: user?.email,
        currentPassword: oldPassword,
        newPassword: newPassword,
      };

      const response = await fetch(`${API_BASE_URL}/api/password/change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Safely parse response body
      const text = await response.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error((data && data.message) ? data.message : 'Failed to update password');
      }

      Alert.alert('Success', 'Your password has been successfully updated!', [
        {
          text: 'OK',
          onPress: () => {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onBack();
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={onBack}
        >
          <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text,
        }}>
          Reset Password
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ margin: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
            Change Your Password
          </Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 24, lineHeight: 22 }}>
            Enter your current password and choose a new secure password.
          </Text>

          {/* Current Password */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
              Current Password
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 16,
            }}>
              <TextInput
                style={{ flex: 1, paddingVertical: 16, fontSize: 16, color: colors.text }}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Enter current password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* New Password */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
              New Password
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 16,
            }}>
              <TextInput
                style={{ flex: 1, paddingVertical: 16, fontSize: 16, color: colors.text }}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
              Must be at least 6 characters
            </Text>
          </View>

          {/* Confirm New Password */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
              Confirm New Password
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 16,
            }}>
              <TextInput
                style={{ flex: 1, paddingVertical: 16, fontSize: 16, color: colors.text }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Requirements */}
          <View style={{
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Password Requirements:
            </Text>
            <Text style={{
              fontSize: 14,
              color: newPassword.length >= 6 ? colors.success : colors.textSecondary,
              marginBottom: 4,
              lineHeight: 18,
            }}>
              • At least 6 characters long
            </Text>
            <Text style={{
              fontSize: 14,
              color: (newPassword !== oldPassword && oldPassword) ? colors.success : colors.textSecondary,
              marginBottom: 4,
              lineHeight: 18,
            }}>
              • Different from current password
            </Text>
            <Text style={{
              fontSize: 14,
              color: (newPassword === confirmPassword && newPassword) ? colors.success : colors.textSecondary,
              marginBottom: 4,
              lineHeight: 18,
            }}>
              • Matches confirmation
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: isLoading ? colors.textMuted : colors.primary,
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: 'center',
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handlePasswordReset}
            disabled={isLoading}
          >
            <Text style={{
              color: isLoading ? colors.textSecondary : colors.surface,
              fontSize: 18,
              fontWeight: '600',
            }}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default SettingsScreen;
