import { Dimensions, Platform } from 'react-native';

// Get current dimensions dynamically
const getCurrentDimensions = () => {
  return Dimensions.get('window');
};

// Device type detection
export const isTablet = () => {
  const { width, height } = getCurrentDimensions();
  const aspectRatio = height / width;
  return width >= 768 && (aspectRatio < 1.6 || Platform.OS === 'ios');
};

export const isPhone = () => !isTablet();

// Screen dimensions - now dynamic
export const getScreenData = () => {
  const { width, height } = getCurrentDimensions();
  return {
    width,
    height,
    isTablet: isTablet(),
    isPhone: isPhone(),
  };
};

// Legacy support - keep for backward compatibility but make dynamic
export const screenData = {
  get width() { return getCurrentDimensions().width; },
  get height() { return getCurrentDimensions().height; },
  get isTablet() { return isTablet(); },
  get isPhone() { return isPhone(); },
};

// Responsive scaling functions
export const scale = (size) => {
  const { width } = getCurrentDimensions();
  const baseWidth = 375; // iPhone 6/7/8 width as base
  const ratio = width / baseWidth;
  
  if (isTablet()) {
    // More conservative scaling for tablets
    return size * Math.min(ratio, 1.8);
  }
  
  return size * ratio;
};

export const verticalScale = (size) => {
  const { height } = getCurrentDimensions();
  const baseHeight = 667; // iPhone 6/7/8 height as base
  const ratio = height / baseHeight;
  
  if (isTablet()) {
    return size * Math.min(ratio, 1.6);
  }
  
  return size * ratio;
};

export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Responsive font sizes
export const getFontSize = (baseSize) => {
  if (isTablet()) {
    return Math.max(baseSize * 1.4, baseSize + 4);
  }
  return baseSize;
};

// Responsive padding/margins
export const getSpacing = (baseSpacing) => {
  if (isTablet()) {
    return baseSpacing * 1.5;
  }
  return baseSpacing;
};

// Responsive dimensions for containers - FIXED to return percentage as string
export const getContainerWidth = (percentage) => {
  if (typeof percentage === 'string') {
    return percentage; // Return as-is if already a string like '100%'
  }
  
  return `${percentage * 100}%`;
};

// Image aspect ratio helpers
export const getImageDimensions = (baseWidth, aspectRatio = 1.5) => {
  const { width } = getCurrentDimensions();
  const scaledWidth = isTablet() ? Math.min(width * 0.9, baseWidth * 1.5) : width * 0.9;
  return {
    width: scaledWidth,
    height: scaledWidth / aspectRatio,
  };
};

// Button dimensions
export const getButtonDimensions = () => {
  if (isTablet()) {
    return {
      minHeight: 50,
      paddingHorizontal: 20,
      paddingVertical: 15,
    };
  }
  return {
    minHeight: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
  };
};

export default {
  scale,
  verticalScale,
  moderateScale,
  getFontSize,
  getSpacing,
  getContainerWidth,
  getImageDimensions,
  getButtonDimensions,
  getScreenData,
  screenData,
  isTablet,
  isPhone,
};
