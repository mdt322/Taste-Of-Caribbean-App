import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
// import { saveOrder } from '../../utils/orderStorage';

const STORE_LOCATION = {
  address: '4 Branford Place',
  city: 'Newark',
  state: 'NJ',
  zip: '07102',
  phone: '(555) 555-5555'
};

const generateTimeSlots = () => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Start from the next 30-minute slot
  let startHour = currentHour;
  let startMinute = currentMinute >= 30 ? 0 : 30;
  if (currentMinute >= 30) startHour += 1;

  // Generate slots for the next 3 hours
  for (let h = 0; h < 6; h++) {
    const hour = (startHour + Math.floor(h / 2)) % 24;
    const minute = (h % 2 === 0) ? startMinute : (startMinute + 30) % 60;
    if (minute === 0 && h !== 0) continue; // Skip if it's exactly on the hour (except first slot)

    const timeString = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
    slots.push(timeString);
  }

  return slots;
};

const Checkout = ({ cart = [], subtotal = 0, tax = 0, deliveryFee = 0, total = 0, onBack, onOrderComplete, user }) => {
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timeSlots = generateTimeSlots();

  const handlePayment = async () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }

    setIsLoading(true);
    try {
      const order = {
        items: cart,
        deliveryMethod,
        selectedTime,
        subtotal,
        tax,
        deliveryFee,
        total,
        storeLocation: STORE_LOCATION
      };

      // await saveOrder(order);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsLoading(false);
      setShowSuccess(true);

      // After 2 seconds, close success message and reset cart
      setTimeout(() => {
        setShowSuccess(false);
        onOrderComplete();
      }, 2000);

    } catch (error) {
      setIsLoading(false);
      alert('Error processing payment. Please try again.');
    }
  };

  const renderStoreLocation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Store Location</Text>
      <View style={styles.locationCard}>
        <MaterialIcons name="location-on" size={19} color="#2e8b57" />
        <View style={styles.locationDetails}>
          <Text style={styles.address}>{STORE_LOCATION.address}</Text>
          <Text style={styles.address}>
            {STORE_LOCATION.city}, {STORE_LOCATION.state} {STORE_LOCATION.zip}
          </Text>
          <Text style={styles.phone}>{STORE_LOCATION.phone}</Text>
        </View>
      </View>
    </View>
  );

  const renderDeliveryOptions = () => (
    <View style={styles.section}>
      <View style={styles.methodHeader}>
        <Text style={styles.sectionTitle}>Delivery Method</Text>
        <View style={styles.selectedMethodIcon}>
          <MaterialIcons
            name={deliveryMethod === 'pickup' ? 'store' : 'delivery-dining'}
            size={24}
            color='#2e8b57'
          />
          <Text style={styles.selectedMethodText}>
            {deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}
          </Text>
        </View>
      </View>
      <View style={styles.deliveryOptions}>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'pickup' && styles.selectedOption]}
          onPress={() => setDeliveryMethod('pickup')}
        >
          <MaterialIcons
            name="store"
            size={24}
            color={deliveryMethod === 'pickup' ? '#2e8b57' : '#666'}
          />
          <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.selectedText]}>
            Pickup
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'delivery' && styles.selectedOption]}
          onPress={() => setDeliveryMethod('delivery')}
        >
          <MaterialIcons
            name="delivery-dining"
            size={24}
            color={deliveryMethod === 'delivery' ? '#2e8b57' : '#666'}
          />
          <Text style={[styles.optionText, deliveryMethod === 'delivery' && styles.selectedText]}>
            Delivery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTimeSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'} Time</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotContainer}>
        {timeSlots.map((time, index) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeSlot, selectedTime === time && styles.selectedTimeSlot]}
            onPress={() => setSelectedTime(time)}
          >
            <MaterialIcons
              name="schedule"
              size={20}
              color={selectedTime === time ? '#fff' : '#666'}
            />
            <Text style={[styles.timeSlotText, selectedTime === time && styles.selectedTimeSlotText]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCartSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.cartItems}>
        {cart.map((item, index) => {
          // Safely derive a monetary price for display. Reward items use points instead of price.
          let priceValue = 0;
          if (item?.points) {
            priceValue = 0;
          } else if (typeof item.price === 'number') {
            priceValue = item.price;
          } else {
            // item.price may be undefined or a string like "$12.99"
            priceValue = parseFloat((item.price || '0').toString().replace('$', '')) || 0;
          }

          return (
            <View key={index} style={styles.cartItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {item?.points ? `${item.points} pts` : `$${priceValue.toFixed(2)}`}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderLoyaltyPoints = () => {
    if (!user) {
      // Not signed in - show missed opportunity
      const pointsMissed = Math.floor(total);
      return (
        <View style={styles.section}>
          <View style={styles.loyaltyHeader}>
            <MaterialIcons name="stars" size={24} color="#ffb300" />
            <Text style={styles.sectionTitle}>Loyalty Points</Text>
          </View>
          <View style={styles.loyaltyContent}>
            <Text style={styles.loyaltyMessage}>
              Sign in to earn <Text style={styles.pointsHighlight}>{pointsMissed} points</Text> on this order!
            </Text>
            <Text style={styles.loyaltySubtext}>
              1 point = $1 spent • Points can be redeemed for free meals
            </Text>
          </View>
        </View>
      );
    }

    // Signed in - show points to be earned
    const pointsToEarn = Math.floor(total);
    return (
      <View style={styles.section}>
        <View style={styles.loyaltyHeader}>
          <MaterialIcons name="stars" size={24} color="#ffb300" />
          <Text style={styles.sectionTitle}>Loyalty Points</Text>
        </View>
        <View style={styles.loyaltyContent}>
          <Text style={styles.loyaltyMessage}>
            You'll earn <Text style={styles.pointsHighlight}>{pointsToEarn} points</Text> with this order!
          </Text>
          <Text style={styles.loyaltySubtext}>
            Current balance: {user.loyaltyPoints || 0} points
          </Text>
        </View>
      </View>
    );
  };

  // Utility: Refund points for a reward item
  const refundRewardPoints = async (item) => {
    if (item?.points && user?.email) {
      try {
        const response = await fetch('http://localhost:5000/api/rewards/refund', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, points: item.points })
        });
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch { data = {}; }
        if (response.ok) {
          // Optionally update user points in parent state
          if (data.user && data.user.rewards !== undefined) {
            user.loyaltyPoints = data.user.rewards;
          }
        } else {
          Alert.alert('Refund failed', data.message || 'Could not refund points');
        }
      } catch (err) {
        Alert.alert('Refund error', 'Network or server error');
      }
    }
  };

  return (
    // <SafeAreaView style={styles.container}>
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
          <MaterialIcons name="arrow-back" size={22} color='#2e8b57' />
          <Text style={styles.backButtonText}>
            Back
          </Text>
        </TouchableOpacity>
        {/* Cross (X) button at top right */}
        <TouchableOpacity onPress={onBack} style={styles.crossButtonContainer}>
          <MaterialIcons name="close" size={28} color="#2e8b57" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {renderStoreLocation()}
        {renderDeliveryOptions()}
        {renderTimeSelection()}
        {renderCartSummary()}
        {renderLoyaltyPoints()}
        <TouchableOpacity
          style={[styles.applePayButton, (!selectedTime || isLoading) && styles.applePayButtonDisabled]}
          onPress={handlePayment}
          disabled={!selectedTime || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="apple" size={24} color="#fff" />
              <Text style={styles.applePayText}>Pay</Text>
            </>
          )}
        </TouchableOpacity>

        <Modal
          transparent
          visible={showSuccess}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <MaterialIcons name="check-circle" size={50} color="#2e8b57" />
              <Text style={styles.successText}>Thank you for ordering from us!</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {/* </SafeAreaView> */}
    </>
  );
};

const styles = StyleSheet.create({
  crossButtonContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e8b57',
    marginTop: 16,
    textAlign: 'center',
  },
  applePayButtonDisabled: {
    opacity: 0.6,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedMethodIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedMethodText: {
    marginLeft: 6,
    color: '#2e8b57',
    fontWeight: '500',
    fontSize: 14,
  },
  timeSlotContainer: {
    flexGrow: 0,
    marginTop: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedTimeSlot: {
    backgroundColor: '#2e8b57',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 13,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButtonContainer: {
    flexDirection: 'row',
    marginRight: 'auto',
    alignItems: 'center',
  },
  backButtonText: {
    padding: 4,
    fontSize: 19,
    color: '#2e8b57',
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDetails: {
    marginLeft: 12,
  },
  address: {
    fontSize: 16,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#2e8b57',
  },
  optionText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '500',
  },
  cartItems: {
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    color: '#2e8b57',
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e8b57',
  },
  applePayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e8b57',
    borderRadius: 20,
    padding: 16,
    marginVertical: 16,
  },
  applePayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loyaltyContent: {
    alignItems: 'center',
  },
  loyaltyMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  pointsHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffb300',
  },
  loyaltySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Checkout;