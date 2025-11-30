import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useMenu } from '../hooks/useMenu';
import MenuManagerModal from '../components/admin/MenuManagerModal';
import FloatingMenuButton from '../components/admin/FloatingMenuButton';

const MenuScreen = ({ route, onAddToCart, user }) => {
  // Get params from route if available
  const params = route?.params || {};
  const finalOnAddToCart = params.onAddToCart || onAddToCart;
  const [isMenuManagerModalVisible, setIsMenuManagerModalVisible] = useState(false);

  const { menuItems, loading } = useMenu();

  const handleSaveMenuItem = (item, type) => {
    console.log('Saving menu item:', item, type);
    // Here you would typically save to your backend/database
  };

  const handleDeleteMenuItem = (itemId, type) => {
    console.log('Deleting menu item:', itemId, type);
    // Here you would typically delete from your backend/database
  };

  const openMenuManager = () => {
    setIsMenuManagerModalVisible(true);
  };

  const closeMenuManager = () => {
    setIsMenuManagerModalVisible(false);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuImage} />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuCategory}>{item.category}</Text>
        <Text style={styles.menuDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.menuFooter}>
          <Text style={styles.menuPrice}>{item.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (finalOnAddToCart) {
                finalOnAddToCart(item);
              }
            }}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Menu</Text>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Floating Menu Manager Button - Admin Only */}
      <FloatingMenuButton 
        visible={user?.isAdmin} 
        onPress={openMenuManager} 
      />

      {/* Menu Manager Modal */}
      <MenuManagerModal
        visible={isMenuManagerModalVisible}
        onClose={closeMenuManager}
        user={user}
        onSaveItem={handleSaveMenuItem}
        onDeleteItem={handleDeleteMenuItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 50,
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  menuCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 18,
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MenuScreen;
