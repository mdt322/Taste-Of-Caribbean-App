import React, { useState } from 'react';
import OrderSummary from '../components/checkout/OrderSummary';
import Checkout from '../components/checkout/Checkout';

const CartScreen = ({ cart, subtotal, tax, deliveryFee, total, onIncrease, onDecrease, onOrderComplete }) => {
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return (
      <Checkout 
        cart={cart}
        subtotal={subtotal}
        tax={tax}
        deliveryFee={deliveryFee}
        total={total}
        onBack={() => setShowCheckout(false)}
        onOrderComplete={() => {
          setShowCheckout(false);
          onOrderComplete();
        }}
      />
    );
  }

  return (
    <OrderSummary 
      items={cart}
      subtotal={subtotal}
      tax={tax}
      deliveryFee={deliveryFee}
      total={total}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onCheckout={() => setShowCheckout(true)}
    />
  );
};

export default CartScreen;
