import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../utils/imageStorage';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const MerchItemManager = () => {
  const [merchItem, setMerchItem] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null
  });
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = '';
      if (imageUri) {
        // Convert URI to Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Upload to Firebase Storage
        const fileName = `${Date.now()}-${menuItem.name.toLowerCase().replace(/\s+/g, '-')}`;
        imageUrl = await uploadImage(blob, fileName);
      }

      // Save to Firestore
      const menuItemData = {
        ...menuItem,
        image: imageUrl,
        price: parseFloat(menuItem.price.replace('$', '')),
      };

      await addDoc(collection(db, 'menuItems'), menuItemData);

      // Reset form
      setMenuItem({
        name: '',
        category: '',
        price: '',
        description: '',
        image: null
      });
      setImageUri(null);

    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={menuItem.name}
        onChangeText={(text) => setMenuItem({ ...menuItem, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={menuItem.category}
        onChangeText={(text) => setMenuItem({ ...menuItem, category: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={menuItem.price}
        onChangeText={(text) => setMenuItem({ ...menuItem, price: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={menuItem.description}
        onChangeText={(text) => setMenuItem({ ...menuItem, description: text })}
        multiline
      />
      <Button title="Pick an image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Save Menu Item" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'cover',
    marginVertical: 10,
  },
});

export default MenuItemManager;
