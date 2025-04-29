import { Alert, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { getApps, initializeApp } from '@react-native-firebase/app';

// Firebase modular API
if (getApps().length === 0) {
  initializeApp();
}

// Google Sign-In Configuration
GoogleSignin.configure({
  webClientId: '573085708711-lrb1ouvpbo1r62t9abjjnaso479978f0.apps.googleusercontent.com', // Replace with real client ID
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

// Safe alert helper
const safeAlert = (title, message) => {
  if (Platform.OS === 'android') {
    setTimeout(() => Alert.alert(title, message), 100); // delay ensures activity is attached
  } else {
    Alert.alert(title, message);
  }
};

// Sign-in function
export const SignInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);
    console.log('✅ Sign-in successful');
  } catch (error) {
    console.error('❌ Sign-in error:', error.code, error.message);
  }
};

