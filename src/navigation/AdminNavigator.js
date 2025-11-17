import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivilegedOptions from '../screens/PrivilegedOptions';

const Stack = createStackNavigator();

function CustomHeader({ title, navigation }) {   // ← accept navigation here
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Change 'More' to whatever tab/screen you want as fallback
      navigation.navigate('Rewards');   // or 'More', 'Home', etc.
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ scene, navigation }) => {
          const { options } = scene.descriptor;
          const title =
            options.headerTitle ?? options.title ?? scene.route.name;

          return <CustomHeader title={title} navigation={navigation} />;
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
        },
      }}
    >
      <Stack.Screen
        name="PrivilegedOptions"
        component={PrivilegedOptions}
        options={{ title: 'Customer Overview' }}
      />
      {/* Add more admin screens here if you have them */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  backButton: { padding: 8, marginRight: 10 },
  title: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
});