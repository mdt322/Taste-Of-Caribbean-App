import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { saveOrder } from '../../utils/orderStorage';

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
    const hour = (startHour + Math.floor(h/2)) % 24;
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

      await saveOrder(order);
      
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
        <MaterialIcons name="location-on" size={24} color="#2e8b57" />
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
        {cart.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>
              ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price.replace('$', '')).toFixed(2)}
            </Text>
          </View>
        ))}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#2e8b57" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    padding: 16,
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