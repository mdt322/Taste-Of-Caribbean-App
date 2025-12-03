import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import OrderSummary from '../components/checkout/OrderSummary';
import Checkout from '../components/checkout/Checkout';

const CartScreen = ({
  cart,
  user,
  onAddToCart,
  onIncrease,
  onDecrease,
  onRemoval,
  onOrderComplete
}) => {
  // Calculate cart totals properly
  const subtotal = (cart || []).reduce((sum, item) => {
    // Handle different item types: menu items with price, reward items with isReward flag
    if (item?.isReward) {
      // Reward items cost 0 (already paid with points)
      return sum + 0;
    } else if (item?.price && typeof item.price === 'string') {
      // Menu items with price string like "$12.99"
      const price = parseFloat(item.price.replace('$', '')) || 0;
      return sum + price * (item.quantity || 1);
    } else if (item?.price && typeof item.price === 'number') {
      // Menu items with numeric price
      return sum + item.price * (item.quantity || 1);
    }
    return sum;
  }, 0);

  const tax = subtotal * 0.08;
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {showCheckout ? (
        <Checkout
          cart={cart}
          subtotal={subtotal}
          tax={tax}
          deliveryFee={deliveryFee}
          total={total}
          onBack={() => setShowCheckout(false)}
          onOrderComplete={() => {
            setShowCheckout(false);
            if (onOrderComplete) {
              onOrderComplete();
            }
          }}
          user={user}
        />
      ) : (
        <OrderSummary
          items={cart}
          subtotal={subtotal}
          tax={tax}
          deliveryFee={deliveryFee}
          total={total}
          onIncrease={onIncrease || (() => console.log('Increase'))}
          onDecrease={onDecrease || (() => console.log('Decrease'))}
          onRemoval={onRemoval || (() => console.log('Removing Item'))}
          onCheckout={() => setShowCheckout(true)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default CartScreen;