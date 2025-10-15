import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const menuItems = [
  {
    name: 'Jerk Chicken',
    price: 15.99,
    category: 'Main Dishes',
    description: 'Spicy grilled chicken marinated in Jamaican jerk spices',
    imageUrl: 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f'
  },
  {
    name: 'Oxtail Stew',
    price: 18.99,
    category: 'Main Dishes',
    description: 'Tender oxtail slow-cooked with herbs and vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15'
  },
  {
    name: 'Plantains',
    price: 5.99,
    category: 'Sides',
    description: 'Sweet fried plantains',
    imageUrl: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c'
  },
  {
    name: 'Rice and Peas',
    price: 4.99,
    category: 'Sides',
    description: 'Coconut rice cooked with kidney beans',
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6'
  }
];

export const initializeMenuData = async () => {
  try {
    console.log('Starting menu initialization...');
    const menuCollection = collection(db, 'menu_items');
    
    for (const item of menuItems) {
      await addDoc(menuCollection, item);
      console.log(`Added menu item: ${item.name}`);
    }
    
    console.log('Menu initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing menu:', error);
    return false;
  }
};
