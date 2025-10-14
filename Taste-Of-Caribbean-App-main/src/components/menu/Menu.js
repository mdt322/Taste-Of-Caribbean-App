/**
 * Menu Page
 * 
 * What this file does:
 * - Shows all food items in a nice grid
 * - Lets users filter by category (Appetizers, Main Dishes, etc.)
 * - Shows food pictures, prices, and descriptions
 * - Lets users add items to cart
 * 
 * Components needed:
 * - Category filter buttons
 * - Food item cards
 * - Add to cart buttons
 * 
 * Features to add:
 * 1. Food categories (Appetizers, Main Dishes, Drinks)
 * 2. Food cards with pictures
 * 3. Prices and descriptions
 * 4. Add to cart button
 * 5. Quantity selector
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useMenu } from '../../hooks/useMenu.js';

const Menu = ({ addToCart }) => {
  const { menuItems, loading, error } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>{item.name[0]}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${typeof item.price === 'number' ? item.price.toFixed(2) : item.price.replace('$', '')}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.categories}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.menuList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#ffb300',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  menuList: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addToCartButton: {
    backgroundColor: '#2e8b57',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: '#ccc',
  },
  cardContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#ffb300',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
});

export default Menu;
