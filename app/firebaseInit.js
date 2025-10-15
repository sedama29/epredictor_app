// firebaseInit.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from './firebaseConfig';

// 🔁 Initialize Firebase app ONCE
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔐 Initialize Firebase Auth ONLY if not already initialized
let auth;
try {
  // this will throw only if not initialized
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // already initialized? Then just get it
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
}

// ✅ Initialize Realtime Database
const database = getDatabase(app);

// Export shared instances
export { app, auth, database };
