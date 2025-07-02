import React, { useState } from 'react';
import {
  useColorScheme,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { styles } from './style/style_index';
import { SignInWithGoogle } from './Login';

function LoginPage() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Determine if the device is small (e.g., older phones)
  const { height: screenHeight } = Dimensions.get('window');
  const isSmallDevice = screenHeight <= 640;

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


  return (
    <SafeAreaView style={[styles.container]}>
      <Image
        source={require('../assets/images/BW_Logo.png')}
        style={[
          styles.logo,
          isSmallDevice && { marginTop: 100, marginBottom: 30 }
        ]}
      />

      <Text
        style={[
          styles.description,
          isSmallDevice && { marginBottom: 30 }
        ]}
      >
        The Enterococcus Predictor (ep), an AI-enabled system to predict the level of enterococcus
        bacteria for a geographical area, is currently in development. If you are a registered user,
        please use your Google account to log in. If you are having issues logging in,
        please contact info@enterococcus.today.
      </Text>

      <TouchableOpacity onPress={handleSignIn}>
        <Image
          source={require('../assets/images/btn_google_signin_dark_normal_web.png')}
          style={[
            styles.logo2,
            isSmallDevice && { marginBottom: 20 }
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
