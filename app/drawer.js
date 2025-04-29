import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, View } from 'react-native';
import Home from './home';
import About from './legend/About';
import Tglo from './legend/Tglo';
import CustomHeader from './CustomHeader';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        header: ({ scene }) => (
          <View style={{ paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
            <CustomHeader title={route.name} showHeader={scene?.route?.name !== 'Home'} />
          </View>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="About..." component={About} />
      <Drawer.Screen name="Texas General Land Office" component={Tglo} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
