import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuItems = [
  {
    name: 'Escovitch Fish',
    category: 'Main Dishes',
    price: 12.99,
    description: 'Crispy fried fish topped with tangy pickled vegetables.',
    image: 'https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/menu-images%2Fescovitch-fish.jpg'
  },
  {
    name: 'Oxtail Stew',
    category: 'Main Dishes',
    price: 14.99,
    description: 'Slow-cooked oxtail in a rich, flavorful gravy with butter beans.',
    image: 'https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/menu-images%2Foxtail-stew.jpg'
  },
  {
    name: 'Fried Plantains',
    category: 'Appetizers',
    price: 4.99,
    description: 'Sweet and crispy fried plantains, a Caribbean favorite.',
    image: 'https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/menu-images%2Ffried-plantains.jpg'
  },
  {
    name: 'Rum Punch',
    category: 'Drinks',
    price: 6.99,
    description: 'A refreshing blend of rum, tropical juices, and a hint of spice.',
    image: 'https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/menu-images%2Frum-punch.jpg'
  }
];

const uploadMenuItems = async () => {
  try {
    for (const item of menuItems) {
      await addDoc(collection(db, 'menuItems'), item);
      console.log(`Added menu item: ${item.name}`);
    }
    console.log('All menu items uploaded successfully!');
  } catch (error) {
    console.error('Error uploading menu items:', error);
  }
};

uploadMenuItems();
