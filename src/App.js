import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, TouchableOpacity, Text } from 'react-native';
import { COLORS, SPACING } from './utils/theme';

import RewardsScreen from './screens/RewardsScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivilegedOptions from './screens/PrivilegedOptions';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    loyaltyPoints: 150,
    isAdmin: true,
  });
  const [cart, setCart] = useState([]);
  const tabBarRef = useRef(null);
  const [showUsersList, setShowUsersList] = useState(false);

  const handleLoginSuccess = (userData) => {
    const isAdmin = userData.email === 'kg539@njit.edu';
    setUser({
      ...userData,
      isAdmin
    });
    tabBarRef.current?.navigate('Profile');
  };


  const handleAddToCart = (item) => {
    setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
  };

  const handleIncrease = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const handleDecrease = (itemId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId && (item.quantity || 1) > 1
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 1) > 0)
    );
  };

  const handleOrderComplete = () => {
    setCart([]);
  };


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          ref={tabBarRef}
          screenOptions={({ route }) => ({
            headerShown: route.name === 'Rewards' || route.name === 'Profile',
            headerTitle: 'Taste of Caribbean',
            tabBarStyle: {
              backgroundColor: COLORS.background.primary,
              height: 60,
              paddingBottom: SPACING.sm,
              paddingTop: SPACING.xs,
              borderTopWidth: 2,
              borderTopColor: COLORS.primary.turquoise,
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Rewards') {
                iconName = focused ? 'gift' : 'gift-outline';
              } else if (route.name === 'Cart') {
                iconName = focused ? 'cart' : 'cart-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: COLORS.primary.turquoise,
            tabBarInactiveTintColor: COLORS.text.secondary,
          })}
        >
          <Tab.Screen
            name="Rewards"
            component={RewardsScreen}
            initialParams={{
              user,
              onAddToCart: handleAddToCart,
              onIncrease: handleIncrease,
              onDecrease: handleDecrease,
              onOrderComplete: handleOrderComplete,
              cart,
              onLoginSuccess: handleLoginSuccess
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            initialParams={{
              cart,
              user,
              onAddToCart: handleAddToCart,
              onIncrease: handleIncrease,
              onDecrease: handleDecrease,
              onOrderComplete: handleOrderComplete,
            }}
            options={{
              tabBarBadge: cart.length > 0 ? cart.length : undefined,
            }}
          />
          <Tab.Screen
            name="Profile"
            children={() => (
              <ProfileScreen 
                user={user}
                cart={cart}
                onAddToCart={handleAddToCart}
                onLoginSuccess={handleLoginSuccess}
                onViewUsers={() => setShowUsersList(true)}
              />
            )}
            options={{
              title: 'My Profile',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}