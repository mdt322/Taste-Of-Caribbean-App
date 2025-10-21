const { collection, getDocs, updateDoc, doc } = require('firebase/firestore');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { db, storage } = require('../config/firebase.js');

// Sample image URLs for Caribbean food items
const sampleImageUrls = {
  'Jerk Chicken': 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f',
  'Oxtail': 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15',
  'Curry Goat': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
  'Ackee and Saltfish': 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
  'Plantains': 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c',
  'Rice and Peas': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6',
  'Patties': 'https://images.unsplash.com/photo-1559847844-5315695dadae',
};

// Function to update menu items with image URLs
const updateMenuWithImages = async () => {
  try {
    const menuCollection = collection(db, 'menu_items');
    const menuSnapshot = await getDocs(menuCollection);
    
    const updatePromises = menuSnapshot.docs.map(async (docSnapshot) => {
      const item = docSnapshot.data();
      const itemRef = doc(db, 'menu_items', docSnapshot.id);
      
      // Only update if the item doesn't already have an imageUrl
      if (!item.imageUrl) {
        // Find a matching image URL or use a default one
        const imageUrl = sampleImageUrls[item.name] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
        
        await updateDoc(itemRef, {
          imageUrl: imageUrl
        });
        
        console.log(`Updated ${item.name} with image URL`);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('Successfully updated all menu items with image URLs');
    
  } catch (error) {
    console.error('Error updating menu items:', error);
  }
};

// Function to upload a local image file
const uploadImage = async (file, imageName) => {
  try {
    const storageRef = ref(storage, `menu-images/${imageName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

module.exports = {
  updateMenuWithImages,
  uploadImage
};
