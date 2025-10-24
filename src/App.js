import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import the actual RewardsScreen component
import RewardsScreen from './screens/RewardsScreen';
import CartScreen from './screens/CartScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    loyaltyPoints: 150,
  });
  const [cart, setCart] = useState([]);

  const handleAddToCart = (item) => {
    setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    console.log('Added to cart:', item);
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
    console.log('Order completed, cart cleared');
  };

  console.log('App.js: Starting with RewardsScreen component');
  console.log('App.js: User state:', user);
  console.log('App.js: Cart state:', cart);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#fff',
              height: 60,
            },
          }}
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
            }}
            options={{
              tabBarLabel: 'Rewards',
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
              tabBarLabel: 'Cart',
              tabBarBadge: cart.length > 0 ? cart.length : undefined,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}