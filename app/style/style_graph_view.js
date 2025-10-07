import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderWidth: 1,
      height: 400, 
    },
    contentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    axisStyles: {
      axis: { stroke: '#756f6a' },
      axisLabel: { fontSize: 16, padding: 30 },
      tickLabels: { fontSize: 10, padding: 5 },
      ticks: { stroke: '#756f6a', size: 5 },
      grid: { stroke: '#FF000019', strokeDasharray: '0' },
      tickLabels: { fontSize: 6, padding: 5 },
      axisLabel: { fontSize: 8, padding: 25 } 
    },
    legendContainer: {
      position: 'absolute',
      top: 40,
      left: 'auto',
      right: 10,
      backgroundColor: 'white',
      width: 180,
      height: 350,
      padding: 10, 
      borderRadius: 5,
    },
    

    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 10,
      marginVertical: 2,
    },
    legendToggleButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      marginHorizontal: 10,
      height: 40,
      justifyContent: 'center',
      zIndex: 1, 
    },

    dropdownButton: {
      padding: 10, 
    },
    dropdownOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.1)' : 'transparent',
    },
    dropdownMenu: {
      position: 'absolute',
      right: isTablet ? 40 : 30,
      top: isTablet ? 100 : 220,
      width: isTablet ? 250 : (Platform.OS === 'ios' ? 160 : 130),
      maxHeight: isTablet ? screenHeight * 0.7 : screenHeight * 0.5,
      backgroundColor: 'white',
      borderRadius: Platform.OS === 'ios' ? 12 : 5,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 8,
        },
      }),
      borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
      borderColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.1)' : 'transparent',
      overflow: 'scroll',
    },
    dropdownContent: {
      paddingVertical: 10,
    },
    dropdownItem: {
      padding: Platform.OS === 'ios' ? 12 : 4,
      borderBottomWidth: Platform.OS === 'ios' ? 0.5 : 1,
      borderBottomColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.1)' : '#ddd',
      minHeight: Platform.OS === 'ios' ? 44 : 'auto',
      justifyContent: 'center',
    },
    dropdownItemSelected: {
      backgroundColor: Platform.OS === 'ios' ? '#007AFF15' : 'lightgray',
      borderRadius: Platform.OS === 'ios' ? 8 : 0,
      marginHorizontal: Platform.OS === 'ios' ? 4 : 0,
    },
    dropdownItemText: {
      color: 'black',
      fontSize: isTablet ? 16 : (Platform.OS === 'ios' ? 16 : 10),
      fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
      textAlign: Platform.OS === 'ios' ? 'left' : 'left',
    },
    dotsButtonBackground: {
      width: 15,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    zoomButton: {
      backgroundColor: '#fff',
      padding: 10,
      marginLeft: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#ccc',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    zoomText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    bottomLegendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingBottom: 12,
      marginTop: 10,
    },
    legendPill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      margin: 5,
    },
    legendPillText: {
      color: 'white',
      fontSize: 12,
    },
    legendTitle: {
      textAlign: 'center',
      fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
      fontSize: isTablet ? 20 : (Platform.OS === 'ios' ? 17 : 14),
      marginTop: Platform.OS === 'ios' ? 16 : 10,
      marginBottom: Platform.OS === 'ios' ? 8 : 4,
      color: Platform.OS === 'ios' ? '#1C1C1E' : '#333',
    },
  });