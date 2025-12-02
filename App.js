import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';  // Assuming you need this for icons elsewhere
import { API_BASE_URL } from './src/utils/apiConfig';

// Import components
import Home from './src/components/home/Home';
import Menu from './src/components/menu/Menu';
import Merch from './src/components/merch/Merch';
import CartScreen from './src/screens/CartScreen';
import Profile from './src/components/profile/Profile';
import AuthModal from './src/components/authmodal/AuthModal';
import RewardsScreen from './src/screens/RewardsScreen';
import PrivilegedOptions from './src/screens/PrivilegedOptions';

const App = () => {
  // State management
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('Home');
  const [authFlag, setAuthFlag] = useState(false);
  const [authMode, setAuthMode] = useState('Sign In');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartFlag, setCartFlag] = useState(false);

  const addToCart = (item) => {
    setCart((prevCart) => {
      let existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, change) => {
    // Use current cart snapshot to determine if we're removing a reward item so we can refund points
    const target = cart.find((i) => i.id === itemId);
    const currentQty = target?.quantity || 0;
    const newQty = Math.max(0, currentQty + change);
    const willBeRemoved = target && newQty === 0;

    // Update local cart immediately
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        // Removes items with quantity value of 0
        .filter((item) => item.quantity > 0)
    );

    // If a reward item is removed (user canceled redemption before checkout), refund points
    if (willBeRemoved && target?.points && user?.email) {
      // Calculate points to refund (points * quantity)
      const pointsToRefund = (target.quantity || 1) * (target.points || 0);
      // fire-and-forget: refund on server and update local user state when done
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/rewards/refund`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: String(user.email).trim().toLowerCase(), points: pointsToRefund })
          });
          const text = await res.text();
          let json = null;
          if (text) {
            try { json = JSON.parse(text); } catch (e) { json = null; }
          }
          if (res.ok && json && json.user) {
            setUser(prev => prev ? { ...prev, loyaltyPoints: json.user.rewards ?? (prev.loyaltyPoints || 0) } : prev);
          }
        } catch (err) {
          console.error('Refund failed', err);
        }
      })();
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      // Reward items use points instead of a monetary price
      if (item?.points) return sum;

      // Safely handle price which may be a number, a string like "$12.99", or undefined
      const priceValue = typeof item.price === 'number'
        ? item.price
        : parseFloat((item.price || '0').toString().replace('$', '')) || 0;
      const quantity = item.quantity || 1;
      return sum + priceValue * quantity;
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

  const handleLoginSuccess = (userData) => {
    // Handle case where userData is the email string (for backward compatibility)
    const email = typeof userData === 'string' ? userData : (userData?.email || '');
    const name = typeof userData === 'string'
      ? email.split('@')[0]
      : userData?.name || userData?.full_name || email.split('@')[0];

    const isAdminUser = email.toLowerCase() === 'kg539@njit.edu'; // Case-insensitive admin check for kg539@njit.edu

    console.log('Login successful:', { email, isAdmin: isAdminUser, userData });

    setIsAdmin(isAdminUser);

    // Use data from the server if available, otherwise use defaults
    const userObj = {
      name: name,
      email: email,
      joinDate: userData?.joinDate || new Date().toLocaleDateString(),
      loyaltyPoints: userData?.loyaltyPoints || userData?.rewards || 150,
      memberSince: userData?.memberSince || userData?.created_at || new Date().toLocaleDateString(),
      avatar: userData?.avatar || null,
      isAdmin: isAdminUser
    };

    setUser(userObj);
    console.log('User state after login:', userObj);
    setAuthFlag(false);  // Close the auth modal after successful login
    setActiveTab('More');  // Navigate to Admin if admin, else Profile
  };

  const handleRegisterSuccess = (userFromServer) => {
    if (!userFromServer) return;
    const userObj = {
      name: userFromServer.name || userFromServer.full_name || '',
      email: userFromServer.email,
      joinDate: userFromServer.joinDate || userFromServer.created_at || new Date().toLocaleDateString(),
      loyaltyPoints: userFromServer.loyaltyPoints ?? userFromServer.rewards ?? 0,
      memberSince: userFromServer.memberSince || userFromServer.created_at || new Date().toLocaleDateString(),
      avatar: userFromServer.avatar || null,
    };
    setUser(userObj);
    setAuthFlag(false);  // Close the auth modal after successful registration
    setActiveTab('More');  // Navigate to Profile after registration
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setAuthFlag(false);
  };

  // onOrderComplete contents moved here for easier access
  // Account order history and point amount updates should be done here
  const handleOrderCompletion = () => {
    if (user) {
      const pointsEarned = Math.floor(calculateTotal().total);
      setUser(prevUser => ({
        ...prevUser,
        loyaltyPoints: (prevUser.loyaltyPoints || 0) + pointsEarned
      }));
    }
    setCart([]);
    setCartFlag(false);
  };


  const checkAdminStatus = (userEmail) => {
    
    return userEmail === 'admin@example.com';
  };

  
  const renderPage = () => {
    switch (activeTab) {

      case 'Home':
        return (
          <Home
            user={user}
            onNavigate={(screen) => setActiveTab(screen)}
            onSignIn={() => setAuthFlag(true)}
          />
        )

      case 'Menu':
        return <Menu addToCart={addToCart} setCartFlag={setCartFlag} cart={cart} />

      case 'Merch':
        return <Merch addToCart={addToCart} setCartFlag={setCartFlag} cart={cart} />

      case 'More':
        return (
          <Profile
            user={user}
            setAuthFlag={setAuthFlag}
            setAuthMode={setAuthMode}
            onLogout={handleLogout}
            cart={cart}
            onAddToCart={addToCart}
            onNavigate={(screen) => {
              console.log('Navigating to:', screen);
              setActiveTab(screen);
            }}
            isAdmin={isAdmin}
          />
        );
      case 'Rewards':
        return (
          <RewardsScreen
            user={user}
            onAddToCart={addToCart}
            cart={cart}
          />
        );
      case 'Admin':
        return <PrivilegedOptions onNavigate={(screen) => setActiveTab(screen)} />;
      default:
        return <Home
          user={user}
          onNavigate={(screen) => setActiveTab(screen)}
          onSignIn={() => setAuthFlag(true)}
        />;
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.appContainer}>
        {isAdmin && (
          <View style={styles.adminBanner}>
            <Text style={styles.adminText}>ADMIN MODE</Text>
          </View>
        )}
        <StatusBar barStyle="dark-content" />

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

        <Modal
          visible={cartFlag}
          animationType="slide"
          statusBarTranslucent={true}
        >
          <View style={styles.cartModalContainer}>
            <View style={styles.cartModalHeader}>
              <Text style={styles.cartModalTitle}>Cart</Text>
              <TouchableOpacity
                onPress={() => setCartFlag(false)}
                style={styles.modalCloseButton}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <CartScreen
              cart={cart}
              subtotal={calculateTotal().subtotal}
              tax={calculateTotal().tax}
              deliveryFee={calculateTotal().deliveryFee}
              total={calculateTotal().total}
              onIncrease={(id) => updateQuantity(id, 1)}
              onDecrease={(id) => updateQuantity(id, -1)}
              onRemoval={(item) => updateQuantity(item.id, item.quantity * -1)}
              onOrderComplete={handleOrderCompletion}
              user={user}
              navigation={{ navigate: (screen) => setActiveTab(screen) }}
            />
          </View>
        </Modal>

        <View style={styles.content}>
          <View style={styles.topBorder}>
            {renderPage()}
          </View>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'Menu' && styles.activeTab]}
            onPress={() => setActiveTab('Menu')}
          >
            <Text style={[styles.tabText, activeTab === 'Menu' && styles.activeTabText]}>
              Menu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'Merch' && styles.activeTab]}
            onPress={() => setActiveTab('Merch')}
          >
            <Text style={[styles.tabText, activeTab === 'Merch' && styles.activeTabText]}>
              Merch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'Rewards' && styles.activeTab]}
            onPress={() => setActiveTab('Rewards')}
          >
            <Text style={[styles.tabText, activeTab === 'Rewards' && styles.activeTabText]}>
              Rewards
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'More' && styles.activeTab]}
            onPress={() => setActiveTab('More')}
          >
            <Text style={[styles.tabText, activeTab === 'More' && styles.activeTabText]}>
              {user ? 'Profile' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    position: 'relative',
  },
  adminBanner: {
    backgroundColor: '#ff4444',
    padding: 5,
    alignItems: 'center',
  },
  adminText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    marginTop: 0,
  },
  cartModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 30, // Add margin to account for status bar
  },
  cartModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10, // Add some left margin for better alignment
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5, // Add some right margin for better touch target
  },
  modalCloseButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  topBorder: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 85 : 65, // Taller tab bar on iOS for home indicator
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 25 : 0, // Add padding for iPhone home indicator
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2, // Add some padding between tabs
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#ffb300',
  },
  tabText: {
    fontSize: 12, // Reduced to fit more tabs
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  activeTabText: {
    color: '#ffb300',
    fontWeight: '500'
  }
});

export default App;