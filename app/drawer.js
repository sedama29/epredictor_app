import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, View } from 'react-native';
import Home from './home';
import About from './legend/About';
import Tglo from './legend/Tglo';
import CustomHeader from './CustomHeader';
import LogoutScreen from './LogoutScreen'; // ✅ Import the logout screen

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
      <Drawer.Navigator
        screenOptions={({ route, navigation }) => ({
          header: () => (
            <CustomHeader
              title={route.name}
              showHeader={true}
              onOpenDrawer={() => navigation.openDrawer()} // ✅ pass it
            />
          ),
        })}
      >

      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="About..." component={About} />
      <Drawer.Screen name="Texas General Land Office" component={Tglo} />
      <Drawer.Screen name="Logout" component={LogoutScreen} /> 
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;