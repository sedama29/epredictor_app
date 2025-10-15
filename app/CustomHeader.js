import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Custom SVG Hamburger Icon
const HamburgerIcon = () => (
  <Svg height="20" width="20" viewBox="0 0 20 20">
    <Path d="M0,4 20,4" stroke="black" strokeWidth="2"/>
    <Path d="M0,9 20,9" stroke="black" strokeWidth="2"/>
    <Path d="M0,14 20,14" stroke="black" strokeWidth="2"/>
  </Svg>
);

const CustomHeader = ({ title, showHeader, onOpenDrawer }) => {
  if (!showHeader) {
    return null;
  }

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isTablet = screenWidth >= 768 || screenHeight >= 1024;

  return (
    <SafeAreaView style={{
      height: Platform.OS === 'ios' ? (isTablet ? 80 : 100) : 50, 
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? (isTablet ? 50 : 70) : 0,
    }}>
      <TouchableOpacity
        onPress={() => {
          if (onOpenDrawer) {
            onOpenDrawer();
          }
        }}
        style={{ 
          marginLeft: 10,
          padding: 10,
          minWidth: 44,
          minHeight: 44,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        activeOpacity={0.7}
      >
        <HamburgerIcon />
      </TouchableOpacity>
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: 'black' }}>{title}</Text>
      </SafeAreaView>
      <SafeAreaView style={{ width: 30 }} />
    </SafeAreaView>
  );
};

export default CustomHeader;
