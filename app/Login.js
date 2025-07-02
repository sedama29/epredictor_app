// Login.js
import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from './firebaseInit'; // ✅ Use shared instance

GoogleSignin.configure({
  webClientId: '159943127152-k6t7v7u50u9upu0a9f1v9pm0k0os48pr.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export const SignInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const userInfo = await GoogleSignin.signIn();

    if (
      !userInfo ||
      typeof userInfo !== 'object' ||
      !userInfo.data ||
      !userInfo.data.user
    ) {
      throw new Error('Google sign-in returned invalid user info');
    }

    const { idToken, user } = userInfo.data;

    if (!idToken) throw new Error('Missing idToken from Google sign-in');
    if (!user || !user.email) throw new Error('Missing user email in Google sign-in');

    const email = user.email.toLowerCase();
    const credential = GoogleAuthProvider.credential(idToken);

    const emailKey = email.replace(/\./g, ',');
    const emailRef = ref(database, `/emails/${emailKey}`);
    const snapshot = await get(emailRef);

    if (!snapshot.exists()) {
      Alert.alert('Access Denied', 'Sorry, your email is not registered with us.');
      return false;
    }

    await signInWithCredential(auth, credential);
    return true;
  } catch (error) {
    console.error('❌ Sign-in error:', error.message, error);
    Alert.alert('Sign-In Failed', error.message || 'An unexpected error occurred.');
    return false;
  }
};
