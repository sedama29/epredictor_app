import React, { useEffect } from 'react';
import { Linking } from 'react-native';

export default function Tglo({ navigation }) {
  useEffect(() => {
    const openTgloLink = async () => {
      await Linking.openURL('https://www.texasbeachwatch.com/');
      navigation.goBack();
    };
    openTgloLink();
  }, [navigation]);

  return null;
}