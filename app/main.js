import React, { useEffect, useState } from 'react';
import {
  useColorScheme,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { styles } from './style/style_index';
import { SignInWithGoogle } from './Login';
import './firebaseInit'; // 🔁 ensures Firebase is initialized
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function LoginPage() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const auth = getAuth();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const { height: screenHeight } = Dimensions.get('window');
  const isSmallDevice = screenHeight <= 640;
  const isTablet = screenWidth >= 768 || screenHeight >= 1024;

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('DrawerNavigator'); // ✅ auto-login
      } else {
        setCheckingAuth(false); // show login screen
      }
    });

    return unsubscribe;
  }, [auth, navigation]);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('DrawerNavigator'); // ✅ auto-login
      } else {
        setCheckingAuth(false); // show login screen
      }
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      const signInSuccess = await SignInWithGoogle();
      if (signInSuccess) {
        navigation.replace('DrawerNavigator');
      }
    } catch (error) {
      console.error('❌ Sign-in failed:', error);
    }
  };

  if (checkingAuth) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (checkingAuth) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <Image
        source={require('../assets/images/BW_Logo.png')}
        style={[
          styles.logo,
          isSmallDevice && { marginTop: 100, marginBottom: 30 },
          isTablet && { 
            width: 350, 
            height: 210, 
            marginTop: 200, 
            marginBottom: 80 
          }
        ]}
      />

      <Text
        style={[
          styles.description,
          isSmallDevice && { marginBottom: 30 },
          isTablet && { 
            fontSize: 16, 
            marginBottom: 80, 
            marginHorizontal: 40,
            lineHeight: 24
          }
        ]}
      >
        The Enterococcus Predictor (ep), an AI-enabled system to predict the level of enterococcus
        bacteria for a geographical area, is currently in development. If you are a registered user,
        please use your preferred account to log in If you are having issues logging in,
        please contact info@enterococcus.today.
      </Text>

      <TouchableOpacity onPress={handleSignIn}>
        <Image
          source={require('../assets/images/btn_google_signin_dark_normal_web.png')}
          style={[
            styles.logo2,
            isSmallDevice && { marginBottom: 20 },
            isTablet && { 
              width: 240, 
              height: 70, 
              marginBottom: 40 
            }
          ]}
        />
      </TouchableOpacity>

      <Text style={[styles.agreementText, isSmallDevice && { marginTop: 30 }]}>
        I agree to the{' '}
        <Text style={styles.hyperlink} onPress={() => navigation.navigate('Disclaimer')}>
          Terms and Conditions
        </Text>
      </Text>
    </SafeAreaView>
  );
}

export default LoginPage;