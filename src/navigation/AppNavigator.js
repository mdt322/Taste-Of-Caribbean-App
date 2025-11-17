import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AdminNavigator from './AdminNavigator';

// Import screens
import MenuScreen from '../screens/MenuScreen';
import RewardsShop from '../components/rewards/Rewards';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function MainTabs({ user, cart, onAddToCart, onLogout, isAdmin = false }) {
  console.log('AppNavigator: Received user:', user);
  console.log('AppNavigator: Received cart:', cart);

  // Cart management functions
  const handleIncrease = (id) => {
    console.log('Increase item:', id);
    // In a real app, this would update the cart state
  };

  const handleDecrease = (id) => {
    console.log('Decrease item:', id);
    // In a real app, this would update the cart state
  };

  const handleOrderComplete = () => {
    console.log('Order completed!');
    // In a real app, this would clear the cart and handle the order
  };

  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Menu') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Rewards') {
              iconName = focused ? 'gift' : 'gift-outline';
            } else if (route.name === 'Cart') {
              iconName = focused ? 'basket' : 'basket-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          initialParams={{ onAddToCart }}
        />
        <Tab.Screen
          name="Rewards"
          component={RewardsShop}
          initialParams={{ user, onAddToCart }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          initialParams={{
            cart,
            user,
            onAddToCart,
            onIncrease: handleIncrease,
            onDecrease: handleDecrease,
            onOrderComplete: handleOrderComplete
          }}
          options={{
            tabBarBadge: cart.length > 0 ? cart.length : undefined,
          }}
        />
        {isAdmin && (
          <Tab.Screen
            name="Admin"
            component={AdminNavigator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="shield" size={size} color={color} />
              ),
              headerShown: false
            }}
          />
        )}
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ user, onLogout, isAdmin }}
        />
      </Tab.Navigator>
  );
}
