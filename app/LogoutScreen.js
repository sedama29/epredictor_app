import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LogoutScreen = () => {
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        navigation.replace('Home'); // 👈 this matches your App.tsx's LoginPage screen name
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    doLogout();
  }, []);

  return null;
};

export default LogoutScreen;
