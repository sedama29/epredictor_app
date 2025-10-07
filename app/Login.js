// Login.js 
import { Alert, Platform } from 'react-native'; // Add Platform
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, OAuthProvider } from 'firebase/auth'; // Add OAuthProvider
import { ref, get } from 'firebase/database';
import { auth, database } from './firebaseInit';

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

export const SignInWithApple = async () => {
  try {
    // Check if Apple Sign-In is available
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    const isAvailable = await appleAuth.isAvailable();
    if (!isAvailable) {
      throw new Error('Apple Sign-In is not available on this device');
    }

    // Perform Apple Sign-In request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const { identityToken, nonce } = appleAuthRequestResponse;

    if (!identityToken) {
      throw new Error('Apple Sign-In failed - no identity token received');
    }

    // Create Firebase credential
    const appleCredential = OAuthProvider.credential('apple.com', {
      idToken: identityToken,
      rawNonce: nonce,
    });

    // Sign in to Firebase
    const userCredential = await signInWithCredential(auth, appleCredential);
    const user = userCredential.user;

    // Check email authorization (same as Google)
    if (user.email) {
      const emailKey = user.email.toLowerCase().replace(/\./g, ',');
      const emailRef = ref(database, `/emails/${emailKey}`);
      const snapshot = await get(emailRef);

      if (!snapshot.exists()) {
        await auth.signOut();
        Alert.alert('Access Denied', 'Sorry, your email is not registered with us.');
        return false;
      }
    } else {
      Alert.alert('Email Required', 'Please ensure your Apple ID has an email address and try again.');
      await auth.signOut();
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Apple Sign-in error:', error.message, error);
    Alert.alert('Sign-In Failed', error.message || 'An unexpected error occurred.');
    return false;
  }
};