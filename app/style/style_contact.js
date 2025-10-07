import { StyleSheet, Platform } from 'react-native';
import { getFontSize, getContainerWidth, isTablet } from './responsive';

export const styles = StyleSheet.create({
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize: getFontSize(14),
      },
      sectionHeader: {
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: getFontSize(11),
      },
      row_contact: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      column_contact: {
        width: isTablet() ? '35%' : (Platform.OS === 'ios' ? '30%' : '25%'),
        fontSize: getFontSize(11),
      },
      value_contact: {
        width: isTablet() ? '65%' : (Platform.OS === 'ios' ? '70%' : '75%'),
        fontSize: getFontSize(11),
      },
})