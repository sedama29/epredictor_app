import { StyleSheet } from 'react-native';
import { getFontSize, getSpacing, scale, verticalScale, isTablet } from './responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start', // Start from top instead of center
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(20), // Reduce top padding
  },
  logo: {
    width: isTablet() ? scale(280) : scale(250),
    height: isTablet() ? verticalScale(140) : verticalScale(150),
    marginBottom: isTablet() ? getSpacing(20) : getSpacing(30), // Reduce bottom margin
    marginTop: isTablet() ? getSpacing(40) : getSpacing(80), // Reduce top margin significantly
    resizeMode: 'contain',
  },
  logo2: {
    width: isTablet() ? scale(200) : scale(170),
    height: isTablet() ? verticalScale(50) : verticalScale(50),
    resizeMode: 'contain',
    marginBottom: getSpacing(15), // Reduce margin
  },
  description: {
    fontSize: getFontSize(10),
    marginBottom: isTablet() ? getSpacing(20) : getSpacing(30), // Reduce margin
    marginLeft: getSpacing(10),
    marginRight: getSpacing(10),
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: getSpacing(20),
    lineHeight: getFontSize(14),
  },
  googleButton: {
    backgroundColor: 'blue',
    padding: getSpacing(10),
    borderRadius: 5,
    marginBottom: getSpacing(20), // Reduce margin
  },
  buttonText: {
    color: 'white',
    fontSize: getFontSize(16),
  },
  agreementText: {
    textAlign: 'center',
    marginTop: isTablet() ? getSpacing(15) : getSpacing(25), // Reduce top margin significantly
    marginHorizontal: getSpacing(30),
    color: 'white',
    fontSize: getFontSize(12),
    lineHeight: getFontSize(16),
    marginBottom: getSpacing(40), // Add bottom margin to keep it away from bottom
  },
  hyperlink: {
    color: 'blue',
    fontSize: getFontSize(12),
  },
  pickerAndDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  agreementContainer: {
    marginHorizontal: getSpacing(30),
    alignItems: 'center',
  },

  
  dotsButton: {
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  
});