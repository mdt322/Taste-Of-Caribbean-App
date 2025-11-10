import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, Button, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Home from './src/components/home/Home';
import Menu from './src/components/menu/Menu';
import Merch from './src/components/merch/Merch';
import CartScreen from './src/screens/CartScreen';
import Profile from './src/components/profile/Profile';
import AuthModal from './src/components/authmodal/AuthModal';
import RewardsScreen from './src/screens/RewardsScreen';

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('Home');

  // authFlag determines whether the pop up for authentication appears
  const [authFlag, setAuthFlag] = useState(false);

  // authMode determines what mode that pop up is in when it appears (Sign In/Registration)
  const [authMode, setAuthMode] = useState('Sign In');
  const [user, setUser] = useState(null); // User authentication state

  // cartFlag determines whether the pop up for cart screen appears
  const [cartFlag, setCartFlag] = useState(false);

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
        .filter((item) => item.quantity > 0)
    );

    // If a reward item is removed (user canceled redemption before checkout), refund points
    if (willBeRemoved && target?.points && user?.email) {
      // Calculate points to refund (points * quantity)
      const pointsToRefund = (target.quantity || 1) * (target.points || 0);
      // fire-and-forget: refund on server and update local user state when done
      (async () => {
        try {
          const res = await fetch('http://localhost:5001/api/rewards/refund', {
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

  const handleLoginSuccess = (userFromServer) => {
    if (!userFromServer) return;
    setUser({
      name: userFromServer.name || userFromServer.full_name || '',
      email: userFromServer.email,
      joinDate: userFromServer.joinDate || userFromServer.created_at || new Date().toLocaleDateString(),
      loyaltyPoints: userFromServer.loyaltyPoints ?? userFromServer.rewards ?? 0,
      memberSince: userFromServer.memberSince || userFromServer.created_at || new Date().toLocaleDateString(),
      avatar: userFromServer.avatar || null,
    });
  };

  const handleRegisterSuccess = (userFromServer) => {
    if (!userFromServer) return;
    setUser({
      name: userFromServer.name || userFromServer.full_name || '',
      email: userFromServer.email,
      joinDate: userFromServer.joinDate || userFromServer.created_at || new Date().toLocaleDateString(),
      loyaltyPoints: userFromServer.loyaltyPoints ?? userFromServer.rewards ?? 0,
      memberSince: userFromServer.memberSince || userFromServer.created_at || new Date().toLocaleDateString(),
      avatar: userFromServer.avatar || null,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAuthFlag(false);
  };

  // Renders page in main screen depending on activeTab
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
        return <Profile
          user={user}
          setAuthFlag={setAuthFlag}
          setAuthMode={setAuthMode}
          onLogout={handleLogout}
          navigation={{ navigate: (screen) => setActiveTab(screen) }}
        />
      case 'Rewards':
        return <RewardsScreen
          user={user}
          onAddToCart={addToCart}
          onUpdateRewards={(newPoints) => setUser(prev => prev ? { ...prev, loyaltyPoints: newPoints } : prev)}
          cart={cart}
        />
    };
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {/* App screen content */}
      <SafeAreaView style={styles.appContainer}>
        <StatusBar barStyle="dark-content" />

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

        {/* Modal pop up that shows the cart */}
        <Modal
          visible={cartFlag}
          animationType="slide"
        >
          <View style={styles.cartModalContainer}>
            <View style={styles.cartModalHeader}>
              <Text style={styles.cartModalTitle}>Cart</Text>
              <TouchableOpacity onPress={() => setCartFlag(false)} style={styles.modalCloseButton} >
                <Text style={styles.modalCloseButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <CartScreen
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
              navigation={{ navigate: (screen) => setActiveTab(screen) }}
            />
          </View>
        </Modal>

        <View style={styles.content}>
          <View style={styles.topBorder}>
            {renderPage()}
          </View>
        </View>

        {/* Footer tabs */}
        {/* Home tab */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* Menu tab */}
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Menu' && styles.activeTab]}
            onPress={() => setActiveTab('Menu')}
          >
            <Text style={[styles.tabText, activeTab === 'Menu' && styles.activeTabText]}>
              Menu
            </Text>
          </TouchableOpacity>

          {/* Order tab/Cart is removed and replaced with */}
          {/* Merch tab */}
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Merch' && styles.activeTab]}
            onPress={() => setActiveTab('Merch')}
          >
            <Text style={[styles.tabText, activeTab === 'Merch' && styles.activeTabText]}>
              Merch
            </Text>
          </TouchableOpacity>

          {/* Rewards tab */}
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Rewards' && styles.activeTab]}
            onPress={() => setActiveTab('Rewards')}
          >
            <Text style={[styles.tabText, activeTab === 'Rewards' && styles.activeTabText]}>
              Rewards
            </Text>
          </TouchableOpacity>

          {/* Profile tab renamed to */}
          {/* More tab */}
          <TouchableOpacity
            style={[styles.tab, activeTab === 'More' && styles.activeTab]}
            onPress={() => setActiveTab('More')}
          >
            <Text style={[styles.tabText, activeTab === 'More' && styles.activeTabText]}>
              More
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  cartModalContainer: {
    flex: 1,
  },
  cartModalHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
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
    height: 65,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
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
    fontSize: 14, // Reduced from 20 to fit 4 tabs
    color: '#666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#ffb300',
    fontWeight: '500',
  },
});
