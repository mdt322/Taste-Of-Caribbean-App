import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Menu from './src/components/menu/Menu';
import CartScreen from './src/screens/CartScreen';
import Profile from './src/components/profile/Profile';
import AuthModal from './src/components/authmodal/AuthModal';

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('Menu');

  // authFlag determines whether the pop up for authentication appears
  const [authFlag, setAuthFlag] = useState(false);

  // authMode determines what mode that pop up is in when it appears (Sign In/Registration)
  const [authMode, setAuthMode] = useState('Sign In');
  const [user, setUser] = useState(null); // User authentication state

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

  const handleLoginSuccess = (email) => {
    // Simulate setting user data after successful login
    setUser({
      name: email.split('@')[0], // Extract name from email for demo
      email: email,
      joinDate: new Date().toLocaleDateString(),
      loyaltyPoints: 150,
      memberSince: new Date().toLocaleDateString(),
      avatar: null
    });
  };

  const handleRegisterSuccess = (userData) => {
    // Set user data after successful registration
    setUser({
      name: userData.name,
      email: userData.email,
      joinDate: new Date().toLocaleDateString(),
      loyaltyPoints: 50, // New users start with some points
      memberSince: new Date().toLocaleDateString(),
      avatar: null
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAuthFlag(false);
  };

  // Renders page in main screen depending on activeTab
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
            // Award loyalty points to signed-in users
            if (user) {
              const pointsEarned = Math.floor(calculateTotal().total);
              setUser(prevUser => ({
                ...prevUser,
                loyaltyPoints: (prevUser.loyaltyPoints || 0) + pointsEarned
              }));
            }
            
            setCart([]);
            setActiveTab('Menu');
          }}
          user={user}
        />
      case 'Profile':
        return <Profile
          user={user}
          setAuthFlag={setAuthFlag}
          setAuthMode={setAuthMode}
          onLogout={handleLogout}
        />
    };
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {/* App screen content */}
      {/* <SafeAreaView style={styles.appContainer}> */}

      {/* Modal pop up that shows sign in and registration page */}

      <Modal
        visible={authFlag}
        animationType="slide"
      >
        <AuthModal
          setAuthFlag={setAuthFlag}
          authMode={authMode}
          setAuthMode={setAuthMode}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </Modal>


      {/* { signinFlag && 
      <View style={styles.signinContainer}>
        <SignIn setSigninFlag={setSigninFlag} />
      </View>
      } */}

      <SafeAreaView style={styles.content}>

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

      </SafeAreaView>
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
      {/* </SafeAreaView> */}
    </SafeAreaProvider >
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
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
    height: 65,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#ffb300',
  },
  tabText: {
    fontSize: 20,
    color: '#666',
  },
  activeTabText: {
    color: '#ffb300',
    fontWeight: '500',
  },
});
