import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Menu from './src/components/menu/Menu';
import CartScreen from './src/screens/CartScreen';

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'Menu' ? (
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
        )}
      </View>
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
          disabled={cart.length === 0}
        >
          <Text style={[styles.tabText, activeTab === 'OrderSummary' && styles.activeTabText]}>
            Cart {cart.length > 0 && `(${cart.length})`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#ffb300',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#ffb300',
    fontWeight: '500',
  },
});
