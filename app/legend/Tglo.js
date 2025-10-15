import React, { useEffect } from 'react';
import { Linking, Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Tglo({ navigation }) {
  useEffect(() => {
    const openTgloLink = async () => {
      try {
        const supported = await Linking.canOpenURL('https://www.texasbeachwatch.com/');
        if (supported) {
          await Linking.openURL('https://www.texasbeachwatch.com/');
        } else {
          Alert.alert('Error', 'Cannot open this URL');
        }
      } catch (error) {
        console.error('Error opening URL:', error);
        Alert.alert('Error', 'Failed to open the link');
      }
    };

    // Open the URL immediately when component loads
    openTgloLink();
    
    // Navigate back after opening the URL
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opening Texas Beach Watch...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});