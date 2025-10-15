import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions,  TouchableWithoutFeedback, Image, Platform } from 'react-native';
import axios from 'axios';
import * as d3 from 'd3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Line, Path, G, Text as SvgText, Rect } from 'react-native-svg';
import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { styles } from '../style/style_graph_view';

const chartPadding = { top: 10, bottom: 45, left: 50, right: 10 };
const configIcon = require('../../assets/images/map_images/configuration_icon.jpg');

const GraphView = ({ siteId, onResetRef }) => {
  const [data, setData] = useState({});
  const [visiblePlots, setVisiblePlots] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [maxYValue, setMaxYValue] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Tablet detection inside component
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isTablet = screenWidth >= 768 || screenHeight >= 1024;
  
  // Keep graph height fixed at 400px for all devices
  const graphHeight = 400;
  
  useEffect(() => {
  }, [tooltipData]);
  useEffect(() => {
  }, [tooltipPos]);

    const windowWidth = Dimensions.get('window').width;
    const minWidth = windowWidth; // make sure it fills at least the screen
    const numDays = (endDate - startDate) / (1000 * 60 * 60 * 24); // number of days

    // Adjust widthPerDay to be responsive
    const widthPerDay = windowWidth < 400 ? 25 : windowWidth < 600 ? 20 : 15;
  const chartWidth = ((endDate - startDate) / (1000 * 60 * 60 * 24)) * widthPerDay + chartPadding.left + chartPadding.right;

  const formatDate = d3.timeFormat("%m/%d");
  const formatDateFull = d3.timeFormat("%Y-%m-%d %H:%M:%S");

  const today = new Date();
  const earlierToday = new Date(today.getTime() - 7 * 60 * 60 * 1000);
  const laterToday = new Date(today.getTime() + 7 * 60 * 60 * 1000);
  const earlierTodayFormatted = formatDateFull(earlierToday);
  const laterTodayFormatted = formatDateFull(laterToday);

  const colors = ['#0B6623', '#FF5733', '#D7AC00', '#FF6600', '#FFC928', '#FF2868', '#EE4B2B', '#300000', '#E67E22'];

  // Zoom and pan state for chart content only
  const chartScale = useSharedValue(1);
  const chartTranslateX = useSharedValue(0);
  const chartTranslateY = useSharedValue(0);
  const lastChartScale = useSharedValue(1);
  const lastChartTranslateX = useSharedValue(0);
  const lastChartTranslateY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: () => {
      lastChartScale.value = chartScale.value;
    },
    onActive: (event) => {
      chartScale.value = Math.max(0.5, Math.min(3, lastChartScale.value * event.scale));
    },
    onEnd: () => {
      lastChartScale.value = chartScale.value;
    }
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: () => {
      lastChartTranslateX.value = chartTranslateX.value;
      lastChartTranslateY.value = chartTranslateY.value;
    },
    onActive: (event) => {
      chartTranslateX.value = lastChartTranslateX.value + event.translationX;
      chartTranslateY.value = lastChartTranslateY.value + event.translationY;
    },
    onEnd: () => {
      lastChartTranslateX.value = chartTranslateX.value;
      lastChartTranslateY.value = chartTranslateY.value;
    }
  });

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: chartScale.value },
      { translateX: chartTranslateX.value },
      { translateY: chartTranslateY.value }
    ]
  }));

  const resetZoom = () => {
    chartScale.value = withTiming(1);
    chartTranslateX.value = withTiming(0);
    chartTranslateY.value = withTiming(0);
    lastChartScale.value = 1;
    lastChartTranslateX.value = 0;
    lastChartTranslateY.value = 0;
  };

  const toggleDropdown = () => {
    try {
      setDropdownVisible(prev => !prev);
    } catch (e) {
      console.error("Dropdown toggle error:", e);
    }
  };

  const handlePlotToggle = (key, group = false) => {
    if (group) {
      setVisiblePlots(prev => ({
        ...prev,
        'Probability_Space_high': !prev['Probability_Space_high'],
        'Probability_Space_low': !prev['Probability_Space_low'],
        'Probability_Space': !prev['Probability_Space'],
      }));
    } else if (key) {
      setVisiblePlots(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://enterococcus.today/waf_2/app/TX/eCount_stat_app/${siteId}.csv?ts=${new Date().getTime()}`);
      const parseDate = d3.timeParse("%Y-%m-%d");
      const parsedData = d3.csvParse(response.data, (row) => {
        const newRow = { date: parseDate(row.date) };
        Object.keys(row).forEach(key => {
          if (key !== 'date' && row[key] !== '') {
            const value = parseFloat(row[key]);
            if (!isNaN(value)) newRow[key] = value;
          }
        });
        return newRow;
      });

      if (!parsedData.length) return;

const filteredData = parsedData.filter(d => d.date); // keep all rows with valid date, even if all values are null
      const allDates = filteredData.map(d => d.date).filter(Boolean);

      const minDate = d3.min(allDates) || new Date();
      const maxDate = d3.max(allDates) ? new Date(d3.max(allDates)) : new Date();

      setStartDate(minDate);
      setEndDate(maxDate);

      const transformedData = filteredData.reduce((acc, row) => {
        Object.keys(row).forEach(key => {
          if (key !== 'date') {
            if (!acc[key]) acc[key] = [];
            acc[key].push({ date: row.date, value: row[key] });
          }
        });
        return acc;
      }, {});

      const allValues = filteredData.flatMap(row => Object.keys(row).filter(k => k !== 'date').map(k => row[k]));
      const dataMax = Math.max(...allValues);
      setMaxYValue(dataMax > 140 ? 250 : 150);
      setData(transformedData);

      const initialVisibility = {};
      Object.keys(transformedData).forEach((key, index) => {
        initialVisibility[key] = index < 4;
      });
      setVisiblePlots(initialVisibility);

      await AsyncStorage.setItem(`lastFetchDate-${siteId}`, new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  useEffect(() => {
    if (siteId) fetchData();
  }, [siteId]);

  // Reset zoom when siteId changes
  useEffect(() => {
    if (siteId) {
      resetZoom();
    }
  }, [siteId]);

  // Expose reset function to parent component
  useEffect(() => {
    if (onResetRef) {
      onResetRef.current = resetZoom;
    }
  }, [onResetRef]);

  if (!startDate || !endDate || Object.keys(data).length === 0) {
    return <Text style={{ padding: 20 }}>Loading graph data...</Text>;
  }

  const xScale = (date) => {
    const d = new Date(date);
    return (d - new Date(startDate)) / (new Date(endDate) - new Date(startDate)) * (screenWidth - chartPadding.left - chartPadding.right) + chartPadding.left;
  };
  const yScale = (value) => {
    return graphHeight - chartPadding.bottom - ((value / (maxYValue + 10)) * (graphHeight - chartPadding.top - chartPadding.bottom));
  };
  const createAreaPath = (data) => {
    if (!data || data.length === 0) return '';
    
    let path = `M ${xScale(data[0].date)} ${yScale(data[0].y)} `;
    
    // Add points for the top line
    for (let i = 1; i < data.length; i++) {
      path += `L ${xScale(data[i].date)} ${yScale(data[i].y)} `;
    }
    
    // From the last point to the bottom
    path += `L ${xScale(data[data.length - 1].date)} ${yScale(data[data.length - 1].y0)} `;
    
    // Add points for the bottom line in reverse
    for (let i = data.length - 2; i >= 0; i--) {
      path += `L ${xScale(data[i].date)} ${yScale(data[i].y0)} `;
    }
    
    // Close the path
    path += 'Z';
    
    return path;
  };
  const createLinePath = (dataPoints) => {
    if (!dataPoints.length) return '';

    let path = '';
    let started = false;

    dataPoints.forEach((point, i) => {
      if (point.value === null || point.value === undefined || isNaN(point.value)) {
        started = false; // break line on null
      } else {
        const x = xScale(point.date);
        const y = yScale(point.value);
        path += `${started ? 'L' : 'M'} ${x} ${y} `;
        started = true;
      }
    });

    return path;
  };

  const handleTooltipClick = (e) => {
    if (!startDate || !endDate || Object.keys(data).length === 0) return;
  
    const touchX = e.nativeEvent.locationX;
    const pageX = e.nativeEvent.pageX;
    const pageY = e.nativeEvent.pageY;
  
    const domainSpan = new Date(endDate) - new Date(startDate);
    const graphWidth = screenWidth - chartPadding.left - chartPadding.right;
    const xFraction = Math.min(Math.max((touchX - chartPadding.left) / graphWidth, 0), 1);
    const estimatedDate = new Date(new Date(startDate).getTime() + xFraction * domainSpan);
  
    const dateSet = new Set();
    Object.entries(data).forEach(([key, series]) => {
      if (visiblePlots[key]) {
        series.forEach(item => {
          if (item?.date) dateSet.add(new Date(item.date).toISOString());
        });
      }
    });
    const dates = Array.from(dateSet).map(d => new Date(d)).sort((a, b) => a - b);
  
    let closestIndex = 0;
    let smallestDiff = Infinity;
    dates.forEach((d, i) => {
      const diff = Math.abs(d - estimatedDate);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = i;
      }
    });
  
    const values = Object.entries(data)
      .filter(([key]) =>
        visiblePlots[key] &&
        key !== 'Probality_Space_high' &&
        key !== 'Probality_Space_low'
      )
      .map(([key, series]) => {
        if (!series?.length) return null;
        const closest = series.reduce((acc, point) => {
          const diff = Math.abs(new Date(point.date) - estimatedDate);
          return diff < acc.diff ? { ...point, diff, originalDate: point.date } : acc;
        }, { value: null, diff: Infinity, originalDate: null });
  
        const maxAllowedDiff = 1000 * 60 * 60 * 12; // 12 hours
        if (closest.value === null || isNaN(closest.value) || closest.diff > maxAllowedDiff) return null;
  
        return {
          name: key,
          value: closest.value.toFixed(2),
        };
      })
      .filter(item => item !== null);
  
    const dateStr = formatDateFull(dates[closestIndex] ?? new Date());
    setTooltipData({ date: dateStr, values });
    setTooltipPos({ x: pageX, y: pageY });
    
    // Auto-hide tooltip after 3 seconds
    setTimeout(() => setTooltipData(null), 3000);
    
  };

  let areaPlotData = [];
  if (visiblePlots['Probality_Space_high'] && visiblePlots['Probality_Space_low'] && data['Probality_Space_high'] && data['Probality_Space_low']) {
    areaPlotData = data['Probality_Space_high'].map((high, index) => {
      const low = data['Probality_Space_low'][index];
      return { date: high.date, y: high.value, y0: low.value };
    });
  }
  
  
let tickValues = [];
if (startDate && endDate) {
  const current = new Date(startDate);
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  let step = 1;
  if (totalDays > 60) step = 14;
  else if (totalDays > 30) step = 7;
  else if (totalDays > 14) step = 3;

  while (current <= endDate) {
    tickValues.push(new Date(current));
    current.setDate(current.getDate() + step);
  }
}

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      {/* Settings Icon (Top Right) */}
      {(
        <View style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10000,  // high zIndex
          padding: 10
        }}>
          <TouchableOpacity onPress={() => {
            setDropdownVisible(true);
          }}>
            <Image source={configIcon} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>
      )}

      {/* Zoom Reset Button */}
      {(
        <View style={{
          position: 'absolute',
          top: 10,
          right: 50,
          zIndex: 10000,
          padding: 10
        }}>
          <TouchableOpacity 
            onPress={resetZoom}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#ccc'
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Dropdown */}
      {dropdownVisible && (
        <Modal
          transparent
          animationType="fade"
          visible={dropdownVisible}
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
            <View style={styles.dropdownOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.dropdownMenu}>
                  <Text style={styles.legendTitle}>Legend </Text>
<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 }}>
  <TouchableOpacity
    onPress={() => {
      const newPlots = { ...visiblePlots };
      Object.keys(data).forEach(key => {
        if (!['Probality_Space', 'Probality_Space_high', 'Probality_Space_low'].includes(key)) {
          newPlots[key] = true;
        }
      });
      setVisiblePlots(newPlots);
    }}
    style={{
      backgroundColor: '#e6f0ff',
      paddingVertical: 3,
      paddingHorizontal: 2,
      borderRadius: 6,
      marginBottom: 5,
      width: '90%',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
      Select All
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
      const newPlots = { ...visiblePlots };
      Object.keys(data).forEach(key => {
        if (!['Probality_Space', 'Probality_Space_high', 'Probality_Space_low'].includes(key)) {
          newPlots[key] = false;
        }
      });
      setVisiblePlots(newPlots);
    }}
    style={{
      backgroundColor: '#fff3f3',
      paddingVertical: 3,
      paddingHorizontal: 2,
      borderRadius: 6,
      width: '90%',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
      Unselect All
    </Text>
  </TouchableOpacity>
</View>

                  {/* Group toggle */}
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      (visiblePlots['Probality_Space_high'] &&
                        visiblePlots['Probality_Space_low'] &&
                        visiblePlots['Probality_Space']) ? styles.dropdownItemSelected : null
                    ]}
                    onPress={() => handlePlotToggle(null, true)}
                  >
                    <Text style={styles.dropdownItemText}>Probability Space</Text>
                  </TouchableOpacity>

                  {/* Individual toggles */}
                  {Object.keys(data)
                    .filter(key => !['Probality_Space_high', 'Probality_Space_low', 'Probality_Space'].includes(key))
                    .map((key, index) => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.dropdownItem,
                          visiblePlots[key] ? styles.dropdownItemSelected : null
                        ]}
                        onPress={() => handlePlotToggle(key)}
                      >
                        <Text style={styles.dropdownItemText}>{key}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}


        <ScrollView horizontal style={styles.container} contentContainerStyle={styles.contentContainer}>
          {Object.keys(data).length > 0 && (
            <View style={{ width: screenWidth, height: graphHeight }}>
              {/* Complete Graph with Zoom */}
              <PanGestureHandler onGestureEvent={panHandler}>
                <Animated.View>
                  <PinchGestureHandler onGestureEvent={pinchHandler}>
                    <Animated.View style={chartAnimatedStyle}>
                      <Svg width={screenWidth} height={graphHeight} onPress={handleTooltipClick}>
                        {/* Background Ranges */}
                        <Rect x={xScale(startDate)} y={yScale(104)} width={xScale(endDate) - xScale(startDate)} height={yScale(35) - yScale(104)} fill="#FFFFE5" />
                        <Rect x={xScale(startDate)} y={yScale(35)} width={xScale(endDate) - xScale(startDate)} height={yScale(0) - yScale(35)} fill="#E5FFE5" />
                        <Rect x={xScale(startDate)} y={yScale(300)} width={xScale(endDate) - xScale(startDate)} height={yScale(104) - yScale(300)} fill="#FFE5E5" />

                        {/* Gridlines and Axes */}
                        {/* X Axis */}
                        <Line x1={chartPadding.left} y1={graphHeight - chartPadding.bottom} x2={screenWidth - chartPadding.right} y2={graphHeight - chartPadding.bottom} stroke="black" strokeWidth={1} />
                        {/* Y Axis */}
                        <Line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={graphHeight - chartPadding.bottom} stroke="black" strokeWidth={1} />

                        {/* X Axis Ticks */}
                        {tickValues.map((tick, index) => (
                          <G key={`tick-x-${index}`}>
                            <Line x1={xScale(tick)} y1={chartPadding.top} x2={xScale(tick)} y2={graphHeight - chartPadding.bottom} stroke="#ddd" />
                            <SvgText x={xScale(tick)} y={graphHeight - chartPadding.bottom + 20} textAnchor="middle" fontSize={10}>{formatDate(tick)}</SvgText>
                          </G>
                        ))}

                        {/* Y Axis Ticks */}
                        {Array.from({ length: 6 }, (_, i) => i * (maxYValue / 5)).map((tick, index) => (
                          <G key={`tick-y-${index}`}>
                            <Line x1={chartPadding.left} y1={yScale(tick)} x2={screenWidth - chartPadding.right} y2={yScale(tick)} stroke="#ddd" />
                            <SvgText x={chartPadding.left - 10} y={yScale(tick) + 4} textAnchor="end" fontSize={12}>{tick}</SvgText>
                          </G>
                        ))}

                        {/* Axis Labels */}
                        <SvgText x={screenWidth / 2} y={graphHeight - 10} textAnchor="middle" fontSize={16} fontWeight="600">Date</SvgText>
                        <SvgText x={-graphHeight / 2} y={20} textAnchor="middle" fontSize={16} fontWeight="600" rotation={-90}>Count</SvgText>

                        {/* Area Plot */}
                        {areaPlotData?.length > 0 && (
                          <Path d={createAreaPath(areaPlotData)} fill="#ECD0B7" opacity={0.8} />
                        )}

                        {/* Plot Lines */}
                        {Object.keys(data).map((key, index) => {
                          if (!visiblePlots[key] || !data[key]?.length) return null;
                          if (['Probality_Space_high', 'Probality_Space_low'].includes(key)) return null;

                          const color = colors[index % colors.length];
                          return (
                            <Path key={key} d={createLinePath(data[key])} stroke={color} strokeWidth={2} fill="none" />
                          );
                        })}

                        {/* Vertical Today Markers */}
                        <Line x1={xScale(earlierTodayFormatted)} y1={chartPadding.top} x2={xScale(earlierTodayFormatted)} y2={graphHeight - chartPadding.bottom} stroke="black" strokeWidth={1} />
                        <Line x1={xScale(laterTodayFormatted)} y1={chartPadding.top} x2={xScale(laterTodayFormatted)} y2={graphHeight - chartPadding.bottom} stroke="black" strokeWidth={1} />
                      </Svg>
                    </Animated.View>
                  </PinchGestureHandler>
                </Animated.View>
              </PanGestureHandler>
            </View>
          )}
        </ScrollView>

        {/* Tooltip */}
        {tooltipData && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: isTablet ? 60 : 50,
              right: isTablet ? 10 : 10,
              backgroundColor: 'white',
              borderColor: '#999',
              borderWidth: 1,
              padding: 10,
              borderRadius: 6,
              zIndex: 9999,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Date: {tooltipData.date}</Text>
            {tooltipData.values.map((item, idx) => (
              <Text key={idx}>{item.name}: {item.value}</Text>
            ))}
          </View>
        )}
      </View>

  );
};

export default GraphView;