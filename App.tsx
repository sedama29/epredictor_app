import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './app/main';
import Disclaimer from './app/disclaimer';
import DrawerNavigator from './app/drawer';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, StatusBar } from 'react-native';

const Stack = createStackNavigator();
enableScreens();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar 
        hidden={false} 
        backgroundColor="transparent" 
        translucent={false}
        barStyle="dark-content"
      />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Disclaimer" component={Disclaimer} options={{ headerShown: false }} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
