import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.REACT_APP_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig.extra.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig.extra.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig.extra.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);