import { StyleSheet } from 'react-native';

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
      left: 'auto', // This will make the positioning automatic based on the 'right' value
      right: 10,
      backgroundColor: 'white',
      width: 180, // Adjust as needed
      height: 350, // Adjust as needed
      padding: 10, 
      borderRadius: 5,
    },
    

    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 10, // Reduced font size
      marginVertical: 2, // Adjusted margin
      // fontFamily: 'Helvetica',
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
    },
    dropdownMenu: {
      position: 'absolute',
      right: 30, // Position near to three dots
      top: 220,   // Adjust this as needed
      width: 130, // Width of the dropdown
      backgroundColor: 'white',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 5,
    },
    dropdownItem: {
      padding: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd', // Add a separator line between items
    },
    dropdownItemSelected: {
      backgroundColor: 'lightgray', // Highlight selected items
    },
    dropdownItemText: {
      color: 'black', 
      fontSize: 10,// Default text color
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
      fontWeight: 'bold',
      fontSize: 14,
      marginTop: 10,
      marginBottom: 4,
      color: '#333',
    },

    // dotsButtonBackground: {
    //   width: 15,
    //   height: 50,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   marginLeft: 10,
    // },
  });