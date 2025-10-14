import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase.js';
import { menuItems } from './menuData.js';

const COLLECTION_NAME = 'menu_items';

// Get all menu items
export const getMenuItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
};

// Add a new menu item
export const addMenuItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
    return { id: docRef.id, ...item };
  } catch (error) {
    console.error('Error adding menu item:', error);
    return null;
  }
};

// Update a menu item
export const updateMenuItem = async (id, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    return false;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }
};

// Initialize database with static menu data
export const initializeMenuData = async () => {
  try {
    const existingItems = await getMenuItems();
    if (existingItems.length === 0) {
      // Only initialize if the collection is empty
      for (const item of menuItems) {
        await addMenuItem(item);
      }
      console.log('Menu data initialized successfully');
      return true;
    }
    console.log('Menu data already exists');
    return false;
  } catch (error) {
    console.error('Error initializing menu data:', error);
    return false;
  }
};