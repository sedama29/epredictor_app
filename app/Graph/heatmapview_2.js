import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, ScrollView, Animated, PixelRatio } from 'react-native';
import MapView, { Marker, Callout, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';

// Dark map style for Google Maps
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const HeatMapView = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const mapHeight =  450;// Increased by 30% from 300
  const mapRef = React.useRef(null);
  const markerRefs = React.useRef({});
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  
  const [allDatesData, setAllDatesData] = useState({}); // Store data for all dates
  const [dates, setDates] = useState([]); // Array of dates
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [riskFilter, setRiskFilter] = useState('all'); // 'all', 'low', 'medium', 'high', 'nodata'
  const [heatMapData, setHeatMapData] = useState([]);
  const [coordsDict, setCoordsDict] = useState({});
  const [pulseOpacity, setPulseOpacity] = useState(0.7);
  const [zoomLevel, setZoomLevel] = useState(8); // Initial zoom level estimate
  
  // Initial map region - centered more on Gulf of Mexico bay
  const initialRegion = {
    latitude: 27.5,
    longitude: -95.0,
    latitudeDelta: 6.0,
    longitudeDelta: 8.0,
  };
  
  // Coordinate offset adjustment for markers to align with circles
  // Negative value shifts markers south (down), positive shifts north (up)
  // Markers appear shifted north, so apply negative offset to shift them south
  const MARKER_OFFSET_LAT = Platform.OS === 'android' ? -0.02 : 0; // Shift markers down to align with circles
  const MARKER_OFFSET_LONG = 0; // Usually not needed
  
  // Smooth pulsing animation for heatmap - matching website (1.0 to 0.7)
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
    
    pulseAnimation.start();
    
    // Update state for pulsing effect - matching website (1.0 to 0.7)
    const interval = setInterval(() => {
      setPulseOpacity(prev => prev === 0.7 ? 1.0 : 0.7);
    }, 1500);
    
    return () => {
      pulseAnimation.stop();
      clearInterval(interval);
    };
  }, []);
  
  // Calculate zoom level from region changes for dynamic circle radius
  const onRegionChangeComplete = (region) => {
    if (region && region.longitudeDelta) {
      const zoom = Math.log2(360 * (screenWidth / 256 / region.longitudeDelta));
      setZoomLevel(zoom);
    }
  };
  
  // Handle marker press - position popup at TOP CENTER of screen
  const handleMarkerPress = async (item) => {
    if (!mapRef.current) return;
    
    try {
      // Get current map region bounds
      const currentRegion = await mapRef.current.getMapBoundaries();
      const { northEast, southWest } = currentRegion;
      const mapWidthInDegrees = northEast.longitude - southWest.longitude;
      const mapHeightInDegrees = northEast.latitude - southWest.latitude;
      
      // Popup dimensions (from styles)
      const popupHeight = 350;
      const topPadding = -10; // Position popup 20px from top edge
      
      // Calculate pixel to coordinate ratios
      const pixelToLatRatio = mapHeightInDegrees / mapHeight;
      
      // Position popup at TOP CENTER of screen
      // The popup appears above the marker, so we need to shift the map down
      // so that the marker appears at a position where its popup shows at top center
      
      // Calculate how far down from the top edge the marker should be positioned
      // to show the popup at the top with padding
      const markerPositionFromTop = popupHeight + topPadding;
      
      // Convert this to a latitude offset from the top of the visible map
      const verticalOffset = (markerPositionFromTop) * pixelToLatRatio;
      
      // Calculate the new center: marker should be at top + popupHeight + padding
      // Since map center is at middle, we need to position marker at upper portion
      const newCenterLatitude = item.lat - (mapHeightInDegrees / 2) + verticalOffset;
      
      // Horizontal: keep centered (no offset needed)
      const newCenterLongitude = item.long;
      
      // Animate to new position - popup will appear at TOP CENTER
      mapRef.current.animateCamera({
        center: {
          latitude: newCenterLatitude,
          longitude: newCenterLongitude
        },
      }, { duration: 300 });
    } catch (error) {
      // Fallback to simple offset
      const simpleOffset = 1.5; // Larger offset to push marker toward top
      mapRef.current.animateCamera({
        center: {
          latitude: item.lat - simpleOffset,
          longitude: item.long
        },
      }, { duration: 300 });
    }
  };
  
  // Reset map to initial position and close any open popups
  const resetMapView = () => {
    // Close all open callouts/popups
    Object.values(markerRefs.current).forEach(markerRef => {
      if (markerRef && markerRef.hideCallout) {
        markerRef.hideCallout();
      }
    });
    
    // Animate map back to initial region
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 500);
    }
  };
  
  // Fetch coordinates
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get('https://enterococcus.today/waf/app/TX/beach_lat_lon.txt');
        let data = response.data;
        
        // Handle if data is object (JSON)
        if (typeof data === 'object' && data !== null) {
          setCoordsDict(data);
        } else if (typeof data === 'string') {
          // Parse as text file
          const lines = data.trim().split('\n');
          const coords = {};
          lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length >= 3) {
              const siteId = parts[0].trim();
              coords[siteId] = {
                lat: parseFloat(parts[1].trim()),
                long: parseFloat(parts[2].trim())
              };
            }
          });
          setCoordsDict(coords);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    
    fetchCoordinates();
  }, []);
  
  // Fetch observed/predicted data with ALL model columns and organize by date
  useEffect(() => {
    const fetchHeatMapData = async () => {
      if (Object.keys(coordsDict).length === 0) {
        console.log('Coordinates not loaded yet');
        return;
      }
      
      console.log('Fetching CSV data...');
      console.log('Available coordinates:', Object.keys(coordsDict).length);
      
      try {
        const response = await axios.get('https://enterococcus.today/waf/app/TX/observed_prediction_data.csv');
        console.log('CSV response received, length:', response.data?.length);
        
        if (!response.data) {
          console.log('No data received from CSV');
          return;
        }
        
        const lines = response.data.trim().split('\n');
        console.log('CSV lines:', lines.length);
        
        if (lines.length < 2) {
          console.log('Not enough data lines in CSV');
          return;
        }
        
        // Parse header to get column indices
        const header = lines[0].split(',').map(h => h.trim());
        const getColumnIndex = (name) => header.indexOf(name);
        
        const dateDataMap = {};
        const dateSet = new Set();
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 4) {
            const dateStr = values[getColumnIndex('date')]?.trim();
            const siteId = values[getColumnIndex('site_id')]?.trim();
            
            // Parse all model columns
            const observedCount = parseFloat(values[getColumnIndex('observed_count')]?.trim());
            const uniMsLSTM = parseFloat(values[getColumnIndex('uniMsLSTM')]?.trim());
            const multiMsLSTM_1 = parseFloat(values[getColumnIndex('multiMsLSTM_1')]?.trim());
            const multiMsLSTM_2 = parseFloat(values[getColumnIndex('multiMsLSTM_2')]?.trim());
            const multiMsLSTM_3 = parseFloat(values[getColumnIndex('multiMsLSTM_3')]?.trim());
            const multiMsLSTM_4 = parseFloat(values[getColumnIndex('multiMsLSTM_4')]?.trim());
            const rnnLSTM_1 = parseFloat(values[getColumnIndex('rnnLSTM_1')]?.trim());
            const randomForest = parseFloat(values[getColumnIndex('randomForest')]?.trim());
            
            // Calculate mean from all numeric values (excluding n/a)
            const allModelValues = [observedCount, uniMsLSTM, multiMsLSTM_1, multiMsLSTM_2, 
                                     multiMsLSTM_3, multiMsLSTM_4, rnnLSTM_1, randomForest];
            const numericValues = allModelValues.filter(v => !isNaN(v));
            const mean = numericValues.length > 0 
              ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length 
              : null;
            
            // Use mean for display, fall back to observed or first available model
            const displayCount = !isNaN(mean) ? mean : (!isNaN(observedCount) ? observedCount : uniMsLSTM);
            
            if (siteId && coordsDict[siteId] && !isNaN(displayCount) && dateStr) {
              dateSet.add(dateStr);
              
              if (!dateDataMap[dateStr]) {
                dateDataMap[dateStr] = {};
              }
              
              dateDataMap[dateStr][siteId] = {
                siteId,
                count: displayCount,
                mean: mean,
                observed: !isNaN(observedCount) ? observedCount : null,
                uniMsLSTM: !isNaN(uniMsLSTM) ? uniMsLSTM : null,
                multiMsLSTM_1: !isNaN(multiMsLSTM_1) ? multiMsLSTM_1 : null,
                multiMsLSTM_2: !isNaN(multiMsLSTM_2) ? multiMsLSTM_2 : null,
                multiMsLSTM_3: !isNaN(multiMsLSTM_3) ? multiMsLSTM_3 : null,
                multiMsLSTM_4: !isNaN(multiMsLSTM_4) ? multiMsLSTM_4 : null,
                rnnLSTM_1: !isNaN(rnnLSTM_1) ? rnnLSTM_1 : null,
                randomForest: !isNaN(randomForest) ? randomForest : null,
                lat: coordsDict[siteId].lat,
                long: coordsDict[siteId].long
              };
            }
          }
        }
        
        const sortedDates = Array.from(dateSet).sort();
        setDates(sortedDates);
        setAllDatesData(dateDataMap);
        
        // Find today's date or closest available date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];
        
        console.log('=== DATE SELECTION DEBUG ===');
        console.log('Today\'s date (local):', todayStr);
        console.log('Total available dates:', sortedDates.length);
        console.log('Last 5 dates:', sortedDates.slice(-5));
        console.log('First 5 dates:', sortedDates.slice(0, 5));
        
        // First try exact match with today
        let targetIndex = sortedDates.indexOf(todayStr);
        console.log('Exact match for today:', targetIndex !== -1 ? `Found at index ${targetIndex}` : 'Not found');
        
        // If not found, find the most recent date (could be today, yesterday, or future)
        if (targetIndex === -1) {
          // Just use the last date in the sorted array (most recent)
          targetIndex = sortedDates.length - 1;
          console.log('Using most recent date at index:', targetIndex);
        }
        
        setCurrentDayIndex(targetIndex);
        console.log('Selected date:', sortedDates[targetIndex]);
        console.log('Selected index:', targetIndex);
        console.log('=== END DATE DEBUG ===');
      } catch (error) {
        console.error('Error fetching heat map data:', error.message);
      }
    };
    
    fetchHeatMapData();
  }, [coordsDict]);
  
  // Update displayed data when date or filter changes
  useEffect(() => {
    if (dates.length === 0 || !allDatesData[dates[currentDayIndex]]) {
      console.log('No data available yet');
      return;
    }
    
    const currentDate = dates[currentDayIndex];
    const dayData = allDatesData[currentDate];
    
    console.log('=== HEATMAP DATA DEBUG ===');
    console.log('Current date:', currentDate);
    console.log('Raw day data keys:', Object.keys(dayData).length);
    console.log('Total coordinates available:', Object.keys(coordsDict).length);
    
    let filtered = Object.values(dayData);
    console.log('Total data points before filter:', filtered.length);
    
    // Apply risk filter
    if (riskFilter === 'low') {
      filtered = filtered.filter(item => item.count < 35);
    } else if (riskFilter === 'medium') {
      filtered = filtered.filter(item => item.count >= 35 && item.count < 104);
    } else if (riskFilter === 'high') {
      filtered = filtered.filter(item => item.count >= 104);
    } else if (riskFilter === 'nodata') {
      // Show stations with coordinates but NO data for this date
      const sitesWithData = new Set(Object.keys(dayData));
      filtered = Object.keys(coordsDict)
        .filter(siteId => !sitesWithData.has(siteId))
        .map(siteId => ({
          siteId,
          count: null,  // No data
          mean: null,
          observed: null,
          uniMsLSTM: null,
          multiMsLSTM_1: null,
          multiMsLSTM_2: null,
          multiMsLSTM_3: null,
          multiMsLSTM_4: null,
          rnnLSTM_1: null,
          randomForest: null,
          lat: coordsDict[siteId].lat,
          long: coordsDict[siteId].long,
          noData: true  // Flag for rendering
        }));
    }
    
    // If 'all' filter, also include "no data" stations
    if (riskFilter === 'all') {
      const sitesWithData = new Set(Object.keys(dayData));
      const noDataStations = Object.keys(coordsDict)
        .filter(siteId => !sitesWithData.has(siteId))
        .map(siteId => ({
          siteId,
          count: null,
          mean: null,
          observed: null,
          uniMsLSTM: null,
          multiMsLSTM_1: null,
          multiMsLSTM_2: null,
          multiMsLSTM_3: null,
          multiMsLSTM_4: null,
          rnnLSTM_1: null,
          randomForest: null,
          lat: coordsDict[siteId].lat,
          long: coordsDict[siteId].long,
          noData: true
        }));
      filtered = [...filtered, ...noDataStations];
    }
    
    console.log('Risk filter:', riskFilter);
    console.log('Filtered data points:', filtered.length);
    console.log('No data stations:', filtered.filter(p => p.noData).length);
    if (filtered.length > 0) {
      console.log('Sample point:', filtered[0]);
      console.log('First 3 points:', filtered.slice(0, 3).map(p => ({
        siteId: p.siteId,
        count: p.count,
        lat: p.lat,
        long: p.long,
        noData: p.noData || false
      })));
    }
    console.log('=== END HEATMAP DATA DEBUG ===');
    
    setHeatMapData(filtered);
  }, [currentDayIndex, riskFilter, dates, allDatesData, coordsDict]);
  
  // Get marker color based on count
  const getMarkerColor = (count) => {
    if (count >= 104) return '#ff0000'; // Red
    if (count >= 35) return '#ffaa00'; // Orange
    return '#28A745'; // Green
  };
  
  // Calculate intensity using the same method as website (combining multiple methods)
  const calculateIntensity = (count, allCounts) => {
    if (!allCounts || allCounts.length === 0) return 0.5;
    
    const maxValue = Math.max(...allCounts);
    const minValue = Math.min(...allCounts);
    const valueRange = maxValue - minValue;
    
    // Method 1: Logarithmic scaling for better distribution
    const logValue = Math.log10(Math.max(count, 1));
    const logMax = Math.log10(Math.max(maxValue, 1));
    const logIntensity = logValue / logMax;
    
    // Method 2: Risk-based thresholds - PRIORITY for red (count > 104)
    let riskIntensity;
    if (count <= 35) {
      // Low risk: map to green range (0.1 to 0.4) - extended green
      riskIntensity = 0.1 + (count / 35) * 0.3;
    } else if (count <= 104) {
      // Medium risk: map to yellow-orange range (0.4 to 0.7)
      riskIntensity = 0.4 + ((count - 35) / 69) * 0.3;
    } else {
      // High risk: map to orange-red range (0.7 to 1.0) - RED for high counts
      // More aggressive scaling: counts just above 104 get 0.7, higher counts get closer to 1.0
      const excessValue = count - 104;
      // Scale more aggressively: excess of 50 gets to 0.85, excess of 100+ gets to 1.0
      const scaledExcess = Math.min(excessValue / 100, 1);
      riskIntensity = 0.7 + scaledExcess * 0.3; // 0.7 to 1.0 range
    }
    
    // Method 3: Relative scaling within current data range
    const relativeIntensity = valueRange > 0 ? (count - minValue) / valueRange : 0.5;
    
    // Combine methods - but ensure counts > 104 ALWAYS get intensity >= 0.7
    let intensity = Math.max(0.1, (riskIntensity * 0.7) + (logIntensity * 0.2) + (relativeIntensity * 0.1));
    
    // CRITICAL: If count > 104, ensure intensity is at least 0.7 (red threshold)
    if (count > 104) {
      intensity = Math.max(0.7, intensity); // Force minimum 0.7 for red
    }
    
    intensity = Math.min(1.0, intensity);
    
    return intensity;
  };
  
  // Get interpolated color from intensity - green -> yellow -> orange -> red (with red focus)
  const getColorFromIntensity = (intensity) => {
    // Clamp intensity to 0-1
    intensity = Math.max(0, Math.min(1, intensity));
    
    let r, g, b;
    
    // Extended green range, yellow, orange, red
    if (intensity <= 0.4) {
      // Green to Yellow (0 to 0.4) - Extended green range
      const t = intensity / 0.4;
      // Start with darker green, transition to bright green, then yellow
      if (t <= 0.5) {
        // Dark green to bright green
        const t2 = t * 2;
        r = Math.round(50 + (76 - 50) * t2);      // 50 -> 76
        g = Math.round(150 + (175 - 150) * t2);    // 150 -> 175
        b = Math.round(50 + (80 - 50) * t2);       // 50 -> 80
      } else {
        // Bright green to yellow
        const t2 = (t - 0.5) * 2;
        r = Math.round(76 + (255 - 76) * t2);      // 76 -> 255
        g = Math.round(175 + (255 - 175) * t2);    // 175 -> 255
        b = Math.round(80 + (0 - 80) * t2);        // 80 -> 0
      }
    } else if (intensity <= 0.7) {
      // Yellow to Orange (0.4 to 0.7)
      const t = (intensity - 0.4) / 0.3;
      r = 255;                                      // Stay at 255
      g = Math.round(255 + (152 - 255) * t);      // 255 -> 152
      b = 0;                                        // Stay at 0
    } else {
      // Orange to Red (0.7 to 1.0) - TRUE RED for high intensity
      const t = (intensity - 0.7) / 0.3;
      r = 255;                                      // Stay at 255 (bright red)
      g = Math.round(152 + (0 - 152) * t);        // 152 -> 0 (orange to pure red)
      b = 0;                                        // Stay at 0
    }
    
    // Opacity based on intensity - lower for outer layers
    const a = 0.2 + (intensity * 0.6); // Range: 0.2 to 0.8
    
    return { r, g, b, a };
  };

  // Get screen density factor for responsive sizing
  const getScreenDensity = () => {
    const pixelRatio = PixelRatio.get();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const screenSize = Math.sqrt(screenWidth * screenHeight);
    
    // Normalize density factor (1.0 for standard screens, scales up/down)
    const baseDensity = 2.0; // Base for standard Android screens
    const densityFactor = pixelRatio / baseDensity;
    
    // Adjust for screen size (larger screens need larger radii)
    const sizeFactor = Math.max(0.8, Math.min(1.5, screenSize / 800));
    
    return densityFactor * sizeFactor;
  };

  // Calculate dynamic radius based on zoom level for better visibility and blending
  const getHeatMapRadius = (zoomLevel) => {
    // Base radius in meters - much larger for better heat map blending
    const baseRadius = 25000; // 25km base radius for extensive overlap and blending
    
    // Aggressive zoom-based scaling - much larger when zoomed out for better combination
    // When zoomed out (zoom 6-8), circles should overlap significantly to create heat map effect
    // When zoomed in (zoom 10+), circles should be smaller but still visible
    const normalizedZoom = Math.max(6, Math.min(14, zoomLevel));
    const zoomScale = Math.max(1.5, Math.min(3.5, (14 - normalizedZoom) / 2.5)); // More aggressive scaling for better blending
    
    return baseRadius * zoomScale;
  };
  
  // Prepare all heatmap points with intensity calculation
  const allCounts = heatMapData
    .filter(item => !item.noData && item.count !== null)
    .map(item => item.count);
  
  const heatMapPoints = heatMapData
    .filter(item => !item.noData && item.count !== null)
    .map(item => {
      const intensity = calculateIntensity(item.count, allCounts);
      let color = getColorFromIntensity(intensity);
      
      // CRITICAL: Force true red (255, 0, 0) for counts > 104
      if (item.count > 104) {
        color = { r: 255, g: 0, b: 0, a: color.a }; // Pure red
        // Also ensure intensity is at least 0.7 for proper filtering
        const adjustedIntensity = Math.max(0.7, intensity);
        return {
          latitude: item.lat,
          longitude: item.long,
          intensity: adjustedIntensity,
          count: item.count,
          color: color,
          item: item
        };
      }
      
      return {
        latitude: item.lat, // Circles use original coordinates
        longitude: item.long,
        intensity: intensity,
        count: item.count,
        color: color,
        item: item
      };
    });
  
  // Extreme points for pulsing layer (intensity > 0.85)
  const extremePoints = heatMapPoints.filter(p => p.intensity > 0.85);
  
  // For iOS: Keep simple grouping by risk level
  const lowRiskPoints = heatMapData
    .filter(item => !item.noData && item.count !== null && item.count < 35)
    .map(item => ({
      latitude: item.lat,
      longitude: item.long,
      weight: calculateIntensity(item.count, allCounts),
      item: item
    }));
    
  const mediumRiskPoints = heatMapData
    .filter(item => !item.noData && item.count !== null && item.count >= 35 && item.count < 104)
    .map(item => ({
      latitude: item.lat,
      longitude: item.long,
      weight: calculateIntensity(item.count, allCounts),
      item: item
    }));
    
  const highRiskPoints = heatMapData
    .filter(item => !item.noData && item.count !== null && item.count >= 104)
    .map(item => ({
      latitude: item.lat,
      longitude: item.long,
      weight: calculateIntensity(item.count, allCounts),
      item: item
    }));
  

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Parse date string directly to avoid timezone issues (2025-10-28 -> Oct 28, 2025)
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Date Navigation */}
        <View style={styles.dateNav}>
          <TouchableOpacity 
            style={[styles.navButton, currentDayIndex === 0 && styles.navButtonDisabled]}
            onPress={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
            disabled={currentDayIndex === 0}
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.dateText}>
            {dates.length > 0 ? formatDate(dates[currentDayIndex]) : 'Loading...'}
          </Text>
          
          <TouchableOpacity 
            style={[styles.navButton, currentDayIndex === dates.length - 1 && styles.navButtonDisabled]}
            onPress={() => setCurrentDayIndex(Math.min(dates.length - 1, currentDayIndex + 1))}
            disabled={currentDayIndex === dates.length - 1}
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>
        
        {/* Risk Level Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            <TouchableOpacity 
              style={[styles.filterButton, riskFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setRiskFilter('all')}
            >
              <Text style={[styles.filterButtonText, riskFilter === 'all' && styles.filterButtonTextActive]}>All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, styles.filterButtonLow, riskFilter === 'low' && styles.filterButtonActiveLow]}
              onPress={() => setRiskFilter('low')}
            >
              <Text style={[styles.filterButtonText, riskFilter === 'low' && styles.filterButtonTextActive]}>Low</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, styles.filterButtonMedium, riskFilter === 'medium' && styles.filterButtonActiveMedium]}
              onPress={() => setRiskFilter('medium')}
            >
              <Text style={[styles.filterButtonText, riskFilter === 'medium' && styles.filterButtonTextActive]}>Medium</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, styles.filterButtonHigh, riskFilter === 'high' && styles.filterButtonActiveHigh]}
              onPress={() => setRiskFilter('high')}
            >
              <Text style={[styles.filterButtonText, riskFilter === 'high' && styles.filterButtonTextActive]}>High</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, styles.filterButtonNoData, riskFilter === 'nodata' && styles.filterButtonActiveNoData]}
              onPress={() => setRiskFilter('nodata')}
            >
              <Text style={[styles.filterButtonText, riskFilter === 'nodata' && styles.filterButtonTextActive]}>No data</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      {/* Map with Legend Overlay */}
      <View style={[styles.mapWrapper, { width: screenWidth - 20, height: mapHeight }]}>
        <View style={styles.mapContainer}>
          <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
        onRegionChangeComplete={onRegionChangeComplete}
        loadingEnabled={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsMyLocationButton={false}
        pitchEnabled={false}
        rotateEnabled={false}
        showsCompass={false}
        showsUserLocation={false}
        toolbarEnabled={false}
      >
        {/* Android: Heatmap with intensity-based interpolated colors - red on top */}
        {Platform.OS === 'android' && (
          <>
            {/* Detect if zoomed out completely - create unified appearance */}
            {(() => {
              const isZoomedOut = zoomLevel < 6; // Fully zoomed out
              
              return (
                <>
                  {/* Render green/yellow/orange points first (lower intensity) - smooth blended heat map */}
                  {heatMapPoints
                    .filter(point => point.intensity < 0.7) // Green, yellow, orange only
                    .map((point, i) => {
                      const densityFactor = getScreenDensity();
                      
                      // When zoomed out: much larger radius for unified appearance
                      // When zoomed in: normal radius
                      let baseRadius, zoomFactor, numLayers;
                      
                      if (isZoomedOut) {
                        // Zoomed out: create large unified blended area
                        baseRadius = 120000 * densityFactor; // Much larger for extensive overlap
                        zoomFactor = 1.0; // No additional zoom scaling when fully zoomed out
                        numLayers = 40; // Many more layers for smooth blending
                      } else {
                        // Normal zoom: standard behavior with more layers
                        zoomFactor = Math.max(1.5, Math.min(3.5, (14 - zoomLevel) / 2));
                        baseRadius = 30000 * densityFactor; // Larger base for better overlap
                        numLayers = 35; // More layers for smoother blending
                      }
                      
                      // Clamp layers on Android to avoid too many drawable objects
                      numLayers = Math.min(numLayers, 24);
                      
                      const maxRadius = baseRadius * zoomFactor;
                      const layers = [];
                      const { r, g, b } = point.color;
                      
                      // base z-index for low intensity circles (render behind red)
                      const baseZ = 10;
                      
                      for (let layer = 0; layer < numLayers; layer++) {
                        const normalizedLayer = layer / numLayers;
                        // Smooth radius fade - more gradual for better blending
                        const layerRadiusRatio = isZoomedOut 
                          ? 1 - (normalizedLayer * 0.98) // Very wide fade when zoomed out
                          : 1 - (normalizedLayer * 0.85); // Wide fade for blending
                        const layerRadius = maxRadius * layerRadiusRatio;
                        
                        // Smooth opacity gradient - starts very transparent, gradually increases
                        // Use exponential fade for smoother blending
                        const fadePower = 1.8; // Smoother fade curve
                        const outerLayerFade = Math.pow(1 - normalizedLayer, fadePower);
                        
                        // Lower opacity values for better blending (like website heat map)
                        const minOpacity = 0.08; // Very transparent at edges
                        const maxOpacity = isZoomedOut ? 0.25 : 0.3; // Still relatively transparent
                        const baseOpacity = minOpacity + (maxOpacity - minOpacity) * (1 - normalizedLayer);
                        
                        // Combine with intensity-based opacity
                        const intensityOpacity = point.color.a * outerLayerFade;
                        const layerOpacity = Math.max(baseOpacity, intensityOpacity * 0.6);
                        
                        const pulsedOpacity = layerOpacity * pulseOpacity;
                        // Keep opacity low for smooth blending
                        const adjustedOpacity = isZoomedOut
                          ? Math.max(0.08, Math.min(0.3, pulsedOpacity)) // Very transparent for blending
                          : Math.max(0.1, Math.min(0.35, pulsedOpacity)); // Transparent for smooth blending
                        
                        layers.push(
                          <Circle
                            key={`heat-low-${i}-layer-${layer}`}
                            center={{ latitude: point.latitude, longitude: point.longitude }}
                            radius={layerRadius}
                            strokeWidth={0}
                            fillColor={`rgba(${r},${g},${b},${adjustedOpacity})`}
                            zIndex={baseZ + layer} // Ensure draw order on Android (lower zIndex)
                          />
                        );
                      }
                      return <React.Fragment key={`heat-low-frag-${i}`}>{layers}</React.Fragment>;
                    })}
                  
                  {/* Render subtle green halos around red/orange points FIRST (behind) - for smooth blending */}
                  {heatMapPoints
                    .filter(point => point.intensity >= 0.7 || point.count > 104) // Red/orange only - ensure count > 104 always included
                    .map((point, i) => {
                      const densityFactor = getScreenDensity();
                      let baseRadius, zoomFactor;
                      
                      if (isZoomedOut) {
                        baseRadius = 120000 * densityFactor;
                        zoomFactor = 1.0;
                      } else {
                        zoomFactor = Math.max(1.5, Math.min(3.5, (14 - zoomLevel) / 2));
                        baseRadius = 30000 * densityFactor;
                      }
                      
                      const maxRadius = baseRadius * zoomFactor;
                      
                      // Subtle green circle around red/orange (halo effect) - very transparent for smooth blending
                      return (
                        <Circle
                          key={`heat-red-green-halo-${i}`}
                          center={{ latitude: point.latitude, longitude: point.longitude }}
                          radius={maxRadius * 1.3} // Green halo is 30% larger
                          strokeWidth={0}
                          fillColor={`rgba(76,175,80,${0.12 * pulseOpacity})`} // Very transparent green for smooth blending
                          zIndex={30} // render behind red layers but above very low intensity layers
                        />
                      );
                    })}
                  
                  {/* Render red points LAST (on top) - smooth blended heat map */}
                  {heatMapPoints
                    .filter(point => point.intensity >= 0.7 || point.count > 104) // Red/orange only - ensure count > 104 always included
                    .map((point, i) => {
                      const densityFactor = getScreenDensity();
                      
                      // When zoomed out: create large unified red blended area
                      // When zoomed in: normal radius with smooth blending
                      let baseRadius, zoomFactor, numLayers;
                      
                      if (isZoomedOut) {
                        // Zoomed out: much larger radius to form unified blended red area
                        baseRadius = 120000 * densityFactor; // Large for extensive overlap
                        zoomFactor = 1.0; // No additional zoom scaling
                        numLayers = 40; // Many layers for smooth blending
                      } else {
                        // Normal zoom: smooth blended circles
                        zoomFactor = Math.max(1.5, Math.min(3.5, (14 - zoomLevel) / 2));
                        baseRadius = 30000 * densityFactor; // Larger for better overlap
                        numLayers = 35; // More layers for smoother blending
                      }
                      
                      // Clamp layers on Android to avoid excessive draw calls
                      numLayers = Math.min(numLayers, 24);
                      
                      const maxRadius = baseRadius * zoomFactor;
                      const layers = [];
                      const { r, g, b } = point.color;
                      
                      // base z-index for red region (render above low intensity)
                      const baseZ = 100;
                      
                      for (let layer = 0; layer < numLayers; layer++) {
                        const normalizedLayer = layer / numLayers;
                        // Smooth radius fade - gradual for better blending
                        const layerRadiusRatio = isZoomedOut
                          ? 1 - (normalizedLayer * 0.98) // Very wide fade when zoomed out
                          : 1 - (normalizedLayer * 0.85); // Wide fade for smooth blending
                        const layerRadius = maxRadius * layerRadiusRatio;
                        
                        // Smooth opacity gradient - red should be more visible but still blend
                        const fadePower = 1.6; // Smooth fade curve
                        const outerLayerFade = Math.pow(1 - normalizedLayer, fadePower);
                        
                        // Red needs higher opacity than green but still blends smoothly
                        const minOpacity = 0.15; // More visible at edges than green
                        const maxOpacity = isZoomedOut ? 0.45 : 0.55; // More visible but still blends
                        const baseOpacity = minOpacity + (maxOpacity - minOpacity) * (1 - normalizedLayer);
                        
                        // Combine with intensity-based opacity
                        const intensityOpacity = point.color.a * outerLayerFade;
                        const layerOpacity = Math.max(baseOpacity, intensityOpacity * 0.8);
                        
                        const pulsedOpacity = layerOpacity * pulseOpacity;
                        // Red should be more visible but still blend smoothly
                        const adjustedOpacity = isZoomedOut
                          ? Math.max(0.15, Math.min(0.5, pulsedOpacity)) // More visible but still blends
                          : Math.max(0.2, Math.min(0.6, pulsedOpacity)); // More visible for red, smooth blending
                        
                        layers.push(
                          <Circle
                            key={`heat-red-${i}-layer-${layer}`}
                            center={{ latitude: point.latitude, longitude: point.longitude }}
                            radius={layerRadius}
                            strokeWidth={0}
                            fillColor={`rgba(${r},${g},${b},${adjustedOpacity})`}
                            zIndex={baseZ + layer} // ensure red layers draw above low intensity circles
                          />
                        );
                      }
                      return <React.Fragment key={`heat-red-frag-${i}`}>{layers}</React.Fragment>;
                    })}
                  
                  {/* Pulsing layer for high-intensity points (intensity > 0.85) - smooth blended */}
                  {extremePoints.map((point, i) => {
                    const densityFactor = getScreenDensity();
                    
                    // When zoomed out: larger pulsing circles
                    let baseRadius, zoomFactor;
                    if (isZoomedOut) {
                      baseRadius = 60000 * densityFactor; // Larger when zoomed out for blending
                      zoomFactor = 1.0;
                    } else {
                      zoomFactor = Math.max(1.5, Math.min(3.5, (14 - zoomLevel) / 2));
                      baseRadius = 15000 * densityFactor; // Larger for better blending
                    }
                    
                    const radius = baseRadius * zoomFactor;
                    const { r, g, b } = point.color;
                    
                    return (
                      <React.Fragment key={`extreme-pulse-frag-${i}`}>
                        {/* Subtle green circle around red for smooth blending */}
                        <Circle
                          key={`extreme-green-halo-${i}`}
                          center={{ latitude: point.latitude, longitude: point.longitude }}
                          radius={radius * (isZoomedOut ? 1.8 : 1.4)}
                          strokeWidth={0}
                          fillColor={`rgba(76,175,80,${0.15 * pulseOpacity})`} // Very transparent for blending
                          zIndex={210}
                        />
                        {/* Red pulsing center - blends smoothly */}
                        <Circle
                          key={`extreme-pulse-${i}`}
                          center={{ latitude: point.latitude, longitude: point.longitude }}
                          radius={radius}
                          strokeWidth={0}
                          fillColor={`rgba(${r},${g},${b},${point.intensity * pulseOpacity * (isZoomedOut ? 0.5 : 0.6)})`} // Blends smoothly
                          zIndex={220}
                        />
                      </React.Fragment>
                    );
                  })}
                </>
              );
            })()}
          </>
        )}
        
        {/* iOS: Simple circles grouped by risk level (keep existing behavior) */}
        {Platform.OS === 'ios' && (
          <>
            {lowRiskPoints.map((p, i) => (
              <Circle
                key={`low-${i}`}
                center={{ latitude: p.latitude, longitude: p.longitude }}
                radius={400}
                strokeWidth={0}
                fillColor={`rgba(50,205,50,${p.weight * 0.85})`}
              />
            ))}
            
            {mediumRiskPoints.map((p, i) => (
              <Circle
                key={`med-${i}`}
                center={{ latitude: p.latitude, longitude: p.longitude }}
                radius={300}
                strokeWidth={0}
                fillColor={`rgba(255,165,0,${p.weight * 0.85})`}
              />
            ))}
            
            {highRiskPoints.map((p, i) => (
              <Circle
                key={`high-${i}`}
                center={{ latitude: p.latitude, longitude: p.longitude }}
                radius={400}
                strokeWidth={0}
                fillColor={`rgba(255,0,0,${p.weight * 0.9})`}
              />
            ))}
            
            {highRiskPoints.map((p, i) => (
              <Circle
                key={`high-pulse-${i}`}
                center={{ latitude: p.latitude, longitude: p.longitude }}
                radius={180}
                strokeWidth={0}
                fillColor={`rgba(255,0,0,${p.weight * pulseOpacity * 0.6})`}
              />
            ))}
          </>
        )}
          
          {/* Interactive Markers with Popups - visible on both iOS and Android */}
          {heatMapData.map((item, index) => {
            // Handle "no data" stations differently
            const isNoData = item.noData || item.count === null;
            // Use visible pixel sizes that maintain size regardless of zoom
            const markerRadius = isNoData ? 3 : (item.count >= 104 ? 6 : item.count >= 35 ? 5 : 4);
            const markerColor = isNoData ? '#808080' : getMarkerColor(item.count);  // Gray for no data
            const riskLevel = isNoData ? 'NO DATA' : (item.count <= 35 ? 'LOW' : item.count <= 104 ? 'MEDIUM' : 'HIGH');
            
            // Markers should be at exact same coordinates as circles (no offset)
            return (
              <Marker
                key={`marker-${item.siteId}-${index}`}
                ref={(ref) => { markerRefs.current[item.siteId] = ref; }}
                coordinate={{
                  latitude: item.lat + (Platform.OS === 'android' ? MARKER_OFFSET_LAT : 0), // apply android offset if needed
                  longitude: item.long // Exact same as circle center
                }}
                anchor={{ x: 0.5, y: 0.5 }} // center marker anchor for consistent alignment
                tracksViewChanges={false}
                onPress={() => handleMarkerPress(item)}
              >
                {/* Custom circular marker - centered with proper alignment */}
                <View style={{
                  width: markerRadius * 2,
                  height: markerRadius * 2,
                  borderRadius: markerRadius,
                  backgroundColor: markerColor,
                  borderWidth: 0.5, // Reduced from 2 to 0.5 for less prominence
                  borderColor: '#ffffff',
                  opacity: 0.9,
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                  elevation: 3
                }} />
                
                {/* Popup Callout - Complete data like welcome.html */}
                {/* Using tooltip for custom styling with autoPan-like behavior */}
                <Callout 
                  tooltip
                  style={styles.calloutContainer}
                  onPress={(e) => {
                    e.stopPropagation();
                    // Keep callout open on press
                  }}
                >
                  <View style={styles.calloutContent}>
                    {/* Header with station name and ID */}
                    <View style={[styles.calloutHeader, { 
                      backgroundColor: markerColor 
                    }]}>
                      <View>
                        <Text style={styles.calloutStationName}>Beach Station</Text>
                        <Text style={styles.calloutStationId}>Station: {item.siteId}</Text>
                      </View>
                    </View>
                    
                    {/* Risk badge */}
                    <View style={styles.calloutBadgeContainer}>
                      <View style={[styles.calloutRiskBadge, { backgroundColor: markerColor }]}>
                        <Text style={styles.calloutRiskBadgeText}>{riskLevel} RISK</Text>
                      </View>
                    </View>
                    
                    {/* Data section with all model values */}
                    <View style={styles.calloutDataSection}>
                      <Text style={styles.calloutDateText}>
                        Date: {dates.length > 0 ? formatDate(dates[currentDayIndex]) : 'N/A'}
                      </Text>
                      
                      <ScrollView style={styles.calloutDataBox}>
                        {/* Mean (bold) - only show if has data */}
                        {!isNoData && item.mean !== null && (
                          <View style={styles.calloutDataRow}>
                            <Text style={styles.calloutDataLabelBold}>Mean:</Text>
                            <Text style={styles.calloutDataValueBold}>{item.mean.toFixed(1)}</Text>
                          </View>
                        )}
                        
                        {/* Observed */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>Observed:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.observed !== null ? item.observed.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                        
                        {/* UniMsLSTM */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>UniMsLSTM:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.uniMsLSTM !== null ? item.uniMsLSTM.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                        
                        {/* MultiMsLSTM-1 */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>MultiMsLSTM-1:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.multiMsLSTM_1 !== null ? item.multiMsLSTM_1.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                        
                        {/* MultiMsLSTM-2 */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>MultiMsLSTM-2:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.multiMsLSTM_2 !== null ? item.multiMsLSTM_2.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                        
                        {/* MultiMsLSTM-3 */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>MultiMsLSTM-3:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.multiMsLSTM_3 !== null ? item.multiMsLSTM_3.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                        
                        {/* MultiMsLSTM-4 */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>MultiMsLSTM-4:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.multiMsLSTM_4 !== null ? item.multiMsLSTM_4.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                        
                        {/* RNN-LSTM */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>RNN-LSTM:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.rnnLSTM_1 !== null ? item.rnnLSTM_1.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                        
                        {/* Random Forest */}
                        <View style={styles.calloutDataRow}>
                          <Text style={styles.calloutDataLabel}>Random Forest:</Text>
                          <Text style={styles.calloutDataValue}>
                            {!isNoData && item.randomForest !== null ? item.randomForest.toFixed(1) : 'n/a'}
                          </Text>
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        
        {/* Legend Overlay on Map */}
        <View style={styles.legendOverlay}>
          <Text style={styles.legendTitle}>Risk Levels</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Low (≤35 CFU)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Medium (35-104 CFU)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f44336' }]} />
              <Text style={styles.legendText}>High ({'>'}104 CFU)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#9E9E9E' }]} />
              <Text style={styles.legendText}>No data</Text>
            </View>
          </View>
          <Text style={styles.legendSubtitle}>CFU/100ml Enterococcus</Text>
        </View>
        
        {/* Reset Button Overlay - Top Right */}
        <TouchableOpacity 
          style={styles.resetButtonOverlay}
          onPress={resetMapView}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  controlsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    minWidth: 35,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  resetButtonOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(108, 117, 125, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  filtersScroll: {
    marginTop: 5,
  },
  filters: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 6,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#005BB5',
  },
  filterButtonLow: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  filterButtonActiveLow: {
    backgroundColor: '#4CAF50',
  },
  filterButtonMedium: {
    backgroundColor: '#fff3e0',
    borderColor: '#FF9800',
  },
  filterButtonActiveMedium: {
    backgroundColor: '#FF9800',
  },
  filterButtonHigh: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  filterButtonActiveHigh: {
    backgroundColor: '#f44336',
  },
  filterButtonNoData: {
    backgroundColor: '#f5f5f5',
    borderColor: '#9E9E9E',
  },
  filterButtonActiveNoData: {
    backgroundColor: '#9E9E9E',
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  mapWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  map: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  legendOverlay: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: 6,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 120,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
    textAlign: 'center',
  },
  legendItems: {
    marginBottom: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legendText: {
    fontSize: 8,
    color: 'white',
    fontWeight: '400',
  },
  legendSubtitle: {
    fontSize: 7,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 3,
    paddingTop: 3,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Callout/Popup styles (exactly matching welcome.html's popup structure)
  // Note: Removed 'tooltip' prop to allow automatic positioning like welcome.html
  // Uses autoPan-like behavior to keep popup in view
  calloutContainer: {
    width: 260,
    maxHeight: 350,
    minWidth: 260, // Maintain consistent width
  },
  calloutContent: {
    width: 260,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  calloutHeader: {
    padding: 8,
    alignItems: 'center',
  },
  calloutStationName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 1,
    textAlign: 'center',
  },
  calloutStationId: {
    color: '#ffffff',
    fontSize: 10,
    opacity: 0.9,
    textAlign: 'center',
  },
  calloutBadgeContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  calloutRiskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  calloutRiskBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  calloutDataSection: {
    padding: 8,
  },
  calloutDateText: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: '#333',
  },
  calloutDataBox: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 6,
    maxHeight: 150,
  },
  calloutDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  calloutDataLabel: {
    fontSize: 10,
    color: '#333',
  },
  calloutDataValue: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  calloutDataLabelBold: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  calloutDataValueBold: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
});

export default HeatMapView;

