import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

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

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
