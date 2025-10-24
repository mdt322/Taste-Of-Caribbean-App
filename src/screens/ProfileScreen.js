import React from 'react';
import Profile from '../components/profile/Profile';

const ProfileScreen = ({ route, navigation, user, setAuthFlag, setAuthMode, onLogout, cart, onAddToCart }) => {
  // Get params from route if available
  const params = route?.params || {};
  const finalUser = params.user || user;
  const finalSetAuthFlag = params.setAuthFlag || setAuthFlag || (() => console.log('setAuthFlag'));
  const finalSetAuthMode = params.setAuthMode || setAuthMode || (() => console.log('setAuthMode'));
  const finalOnLogout = params.onLogout || onLogout || (() => console.log('Logout'));
  const finalCart = params.cart || cart || [];
  const finalOnAddToCart = params.onAddToCart || onAddToCart || (() => console.log('Add to cart'));

  return (
    <Profile
      user={finalUser}
      setAuthFlag={finalSetAuthFlag}
      setAuthMode={finalSetAuthMode}
      onLogout={finalOnLogout}
      cart={finalCart}
      onAddToCart={finalOnAddToCart}
      navigation={navigation}
    />
  );
};

export default ProfileScreen;
