import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//import { SafeAreaView } from 'react-native';
import Menu from './src/components/menu/Menu';
import CartScreen from './src/screens/CartScreen';
import Profile from './src/components/profile/Profile';

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('Menu');

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('$', ''));
      return sum + price * item.quantity;
    }, 0);
    const tax = subtotal * 0.13; // 13% tax
    const deliveryFee = cart.length > 0 ? 5.00 : 0; // $5 delivery fee if cart not empty
    return {
      subtotal,
      tax,
      deliveryFee,
      total: subtotal + tax + deliveryFee
    };
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'Menu':
        return <Menu addToCart={addToCart} />
      case 'OrderSummary':
        return <CartScreen
            cart={cart}
            {...calculateTotal()}
            onIncrease={(id) => updateQuantity(id, 1)}
            onDecrease={(id) => updateQuantity(id, -1)}
            onOrderComplete={() => {
              setCart([]);
              setActiveTab('Menu');
            }}
          />
        case 'Profile':
          return <Profile />
    };
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {/* App screen content */}
      <View style={styles.content}>
        
        {/* Old render page view */}
        {/* {activeTab === 'Menu' ? (
          <Menu addToCart={addToCart} />
        ) : (
          <CartScreen
            cart={cart}
            {...calculateTotal()}
            onIncrease={(id) => updateQuantity(id, 1)}
            onDecrease={(id) => updateQuantity(id, -1)}
            onOrderComplete={() => {
              setCart([]);
              setActiveTab('Menu');
            }}
          />
        )} */}

      {/* New way to render pages, needed for more than 2 pages */}
      <>{renderPage()}</>

      </View>
      {/* Footer tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Menu' && styles.activeTab]}
          onPress={() => setActiveTab('Menu')}
        >
          <Text style={[styles.tabText, activeTab === 'Menu' && styles.activeTabText]}>
            Menu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'OrderSummary' && styles.activeTab]}
          onPress={() => setActiveTab('OrderSummary')}
          // disabled={cart.length === 0}
        >
          <Text style={[styles.tabText, activeTab === 'OrderSummary' && styles.activeTabText]}>
            Cart {cart.length > 0 && `(${cart.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Profile' && styles.activeTab]}
          onPress={() => setActiveTab('Profile')}
        >
          <Text style={[styles.tabText, activeTab === 'Profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#ffb300',
  },
  tabText: {
    fontSize: 18,
    color: '#666',
  },
  activeTabText: {
    color: '#ffb300',
    fontWeight: '500',
  },
});
