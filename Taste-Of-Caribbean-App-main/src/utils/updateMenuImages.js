import { db } from '../config/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const sampleImages = {
  'Jerk Chicken': 'https://example.com/jerk-chicken.jpg',
  'Oxtail': 'https://example.com/oxtail.jpg',
  'Curry Goat': 'https://example.com/curry-goat.jpg',
  // Add more mappings as needed
};

// Function to update menu items with image URLs
export const updateMenuImages = async () => {
  try {
    const menuCollection = collection(db, 'menu_items');
    const menuSnapshot = await getDocs(menuCollection);
    
    const updatePromises = menuSnapshot.docs.map(async (docSnapshot) => {
      const item = docSnapshot.data();
      const itemRef = doc(db, 'menu_items', docSnapshot.id);
      
      // Only update if the item doesn't already have an imageUrl
      if (!item.imageUrl) {
        // Find a matching image URL or use a default one
        const imageUrl = sampleImages[item.name] || 'https://example.com/default-food.jpg';
        
        await updateDoc(itemRef, {
          imageUrl: imageUrl
        });
      }
    });
    
    await Promise.all(updatePromises);
    console.log('Successfully updated menu items with image URLs');
    
  } catch (error) {
    console.error('Error updating menu items:', error);
  }
};
