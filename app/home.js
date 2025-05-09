import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, SafeAreaView, Text, Image, Dimensions, Modal, TouchableOpacity, FlatList, ImageBackground, View } from 'react-native';
import axios from 'axios';
import { styles } from './style/style_home';
import Data90DaysView from './data/Data90DaysView';
import ContactDetailsView from './data/ContactDetailsView';
import GraphView from './Graph/GraphView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, SceneMap } from 'react-native-tab-view';

import Map_L1 from '../assets/map_images/map_L1.png';
import Map_L2_P1 from '../assets/map_images/map_L2-P1.png';
import Map_L2_P2 from '../assets/map_images/map_L2-P2.png';
import Map_L2_P3 from '../assets/map_images/map_L2-P3.png';
import Map_L2_P4 from '../assets/map_images/map_L2-P4.png';
import Map_L2_P5 from '../assets/map_images/map_L2-P5.png';
import Map_L2_P6 from '../assets/map_images/map_L2-P6.png';
import Map_L3_P1_P1 from '../assets/map_images/map_L3-P1-P1.png';
import Map_L3_P1_P2 from '../assets/map_images/map_L3-P1-P2.png';
import Map_L3_P1_P3 from '../assets/map_images/map_L3-P1-P3.png';
import Map_L3_P2_P1 from '../assets/map_images/map_L3-P2-P1.png';
import Map_L3_P2_P2 from '../assets/map_images/map_L3-P2-P2.png';
import Map_L3_P3_P1 from '../assets/map_images/map_L3-P3-P1.png';
import Map_L3_P3_P2 from '../assets/map_images/map_L3-P3-P2.png';
import Map_L3_P3_P3 from '../assets/map_images/map_L3-P3-P3.png';
import Map_L3_P3_P4 from '../assets/map_images/map_L3-P3-P4.png';
import Map_L3_P4_P1 from '../assets/map_images/map_L3-P4-P1.png';
import Map_L3_P4_P2 from '../assets/map_images/map_L3-P4-P2.png';
import Map_L3_P5_P1 from '../assets/map_images/map_L3-P5-P1.png';
import Map_L3_P5_P2 from '../assets/map_images/map_L3-P5-P2.png';
import Map_L3_P5_P3 from '../assets/map_images/map_L3-P5-P3.png';
import Map_L3_P5_P4 from '../assets/map_images/map_L3-P5-P4.png';
import Map_L3_P5_P5 from '../assets/map_images/map_L3-P5-P5.png';
import Map_L3_P5_P6 from '../assets/map_images/map_L3-P5-P6.png';
import Map_L3_P6_P1 from '../assets/map_images/map_L3-P6-P1.png';
import Map_L3_P6_P2 from '../assets/map_images/map_L3-P6-P2.png';
import Map_L4_P1_P2_P1 from '../assets/map_images/map_L4-P1-P2-P1.png';
import Map_L4_P1_P2_P2 from '../assets/map_images/map_L4-P1-P2-P2.png';
import Map_L4_P1_P2_P3 from '../assets/map_images/map_L4-P1-P2-P3.png';
import Map_L4_P1_P2_P4 from '../assets/map_images/map_L4-P1-P2-P4.png';
import Map_L4_P1_P2_P5 from '../assets/map_images/map_L4-P1-P2-P5.png';
import Map_L4_P1_P2_P6 from '../assets/map_images/map_L4-P1-P2-P6.png';
import Map_L4_P3_P1_P1 from '../assets/map_images/map_L4-P3-P1-P1.png';
import Map_L4_P3_P1_P2 from '../assets/map_images/map_L4-P3-P1-P2.png';
import Map_L4_P3_P1_P3 from '../assets/map_images/map_L4-P3-P1-P3.png';
import Map_L4_P3_P1_P4 from '../assets/map_images/map_L4-P3-P1-P4.png';
import Map_L4_P3_P1_P5 from '../assets/map_images/map_L4-P3-P1-P5.png';
import Map_L4_P3_P1_P6 from '../assets/map_images/map_L4-P3-P1-P6.png';
import Map_L4_P3_P1_P7 from '../assets/map_images/map_L4-P3-P1-P7.png';
import Map_L4_P3_P2_P1 from '../assets/map_images/map_L4-P3-P2-P1.png';
import Map_L4_P3_P2_P2 from '../assets/map_images/map_L4-P3-P2-P2.png';
import Map_L4_P3_P2_P3 from '../assets/map_images/map_L4-P3-P2-P3.png';
import Map_L4_P3_P2_P4 from '../assets/map_images/map_L4-P3-P2-P4.png';
import Map_L4_P3_P3_P1 from '../assets/map_images/map_L4-P3-P3-P1.png';
import Map_L4_P3_P3_P2 from '../assets/map_images/map_L4-P3-P3-P2.png';
import Map_L4_P3_P4_P1 from '../assets/map_images/map_L4-P3-P4-P1.png';
import Map_L4_P3_P4_P2 from '../assets/map_images/map_L4-P3-P4-P2.png';
import Map_L4_P3_P4_P3 from '../assets/map_images/map_L4-P3-P4-P3.png';
import Map_L4_P5_P2_P1 from '../assets/map_images/map_L4-P5-P2-P1.png';
import Map_L4_P5_P2_P2 from '../assets/map_images/map_L4-P5-P2-P2.png';
import Map_L4_P5_P2_P3 from '../assets/map_images/map_L4-P5-P2-P3.png';
import Map_L4_P5_P2_P4 from '../assets/map_images/map_L4-P5-P2-P4.png';
import Map_L4_P5_P2_P5 from '../assets/map_images/map_L4-P5-P2-P5.png';
import Map_L4_P5_P2_P6 from '../assets/map_images/map_L4-P5-P2-P6.png';
import Map_L4_P5_P3_P1 from '../assets/map_images/map_L4-P5-P3-P1.png';
import Map_L4_P5_P3_P2 from '../assets/map_images/map_L4-P5-P3-P2.png';
import Map_L4_P5_P3_P3 from '../assets/map_images/map_L4-P5-P3-P3.png';
import Map_L4_P5_P4_P1 from '../assets/map_images/map_L4-P5-P4-P1.png';
import Map_L4_P5_P4_P2 from '../assets/map_images/map_L4-P5-P4-P2.png';
import Map_L4_P5_P4_P3 from '../assets/map_images/map_L4-P5-P4-P3.png';
import Map_L4_P5_P4_P4 from '../assets/map_images/map_L4-P5-P4-P4.png';

import Map_L4_P5_P5_P1 from '../assets/map_images/map_L4-P5-P5-P1.png';
import Map_L4_P5_P5_P2 from '../assets/map_images/map_L4-P5-P5-P2.png';
import Map_L4_P5_P5_P3 from '../assets/map_images/map_L4-P5-P5-P3.png';
import Map_L4_P5_P5_P4 from '../assets/map_images/map_L4-P5-P5-P4.png';
import Map_L4_P5_P5_P5 from '../assets/map_images/map_L4-P5-P5-P5.png';
import Map_L4_P6_P1_P1 from '../assets/map_images/map_L4-P6-P1-P1.png';
import Map_L4_P6_P1_P2 from '../assets/map_images/map_L4-P6-P1-P2.png';
import Map_L4_P6_P1_P3 from '../assets/map_images/map_L4-P6-P1-P3.png';
import Map_L4_P6_P1_P4 from '../assets/map_images/map_L4-P6-P1-P4.png';
import Map_L4_P6_P2_P1 from '../assets/map_images/map_L4-P6-P2-P1.png';
import Map_L4_P6_P2_P2 from '../assets/map_images/map_L4-P6-P2-P2.png';
import Map_L4_P6_P2_P3 from '../assets/map_images/map_L4-P6-P2-P3.png';
import Map_L5_P3_P1_P1_P1 from '../assets/map_images/map_L5-P3-P1-P1-P1.png';
import Map_L5_P3_P1_P1_P2 from '../assets/map_images/map_L5-P3-P1-P1-P2.png';
import Map_L5_P3_P1_P1_P3 from '../assets/map_images/map_L5-P3-P1-P1-P3.png';
import Map_L5_P3_P1_P2_P1 from '../assets/map_images/map_L5-P3-P1-P2-P1.png';
import Map_L5_P3_P1_P2_P2 from '../assets/map_images/map_L5-P3-P1-P2-P2.png';
import Map_L5_P3_P2_P2_P1 from '../assets/map_images/map_L5-P3-P2-P2-P1.png';
import Map_L5_P3_P2_P2_P2 from '../assets/map_images/map_L5-P3-P2-P2-P2.png';
import Map_L5_P3_P2_P2_P3 from '../assets/map_images/map_L5-P3-P2-P2-P3.png';
import Map_L5_P3_P2_P2_P4 from '../assets/map_images/map_L5-P3-P2-P2-P4.png';
import Map_L5_P3_P3_P1_P1 from '../assets/map_images/map_L5-P3-P3-P1-P1.png';
import Map_L5_P3_P3_P1_P2 from '../assets/map_images/map_L5-P3-P3-P1-P2.png';

import Map_L5_P5_P4_P1_P1 from '../assets/map_images/map_L5-P5-P4-P1-P1.png';
import Map_L5_P5_P4_P1_P2 from '../assets/map_images/map_L5-P5-P4-P1-P2.png';
import Map_L5_P5_P4_P1_P3 from '../assets/map_images/map_L5-P5-P4-P1-P3.png';
import Map_L5_P5_P4_P1_P4 from '../assets/map_images/map_L5-P5-P4-P1-P4.png';
import Map_L5_P5_P4_P1_P5 from '../assets/map_images/map_L5-P5-P4-P1-P5.png';

import Map_L5_P5_P4_P3_P1 from '../assets/map_images/map_L5-P5-P4-P3-P1.png';
import Map_L5_P5_P4_P3_P2 from '../assets/map_images/map_L5-P5-P4-P3-P2.png';
import Map_L5_P5_P4_P3_P3 from '../assets/map_images/map_L5-P5-P4-P3-P3.png';
import Map_L5_P5_P4_P3_P4 from '../assets/map_images/map_L5-P5-P4-P3-P4.png';

import Map_L5_P5_P5_P4_P1 from '../assets/map_images/map_L5-P5-P5-P4-P1.png';
import Map_L5_P5_P5_P4_P2 from '../assets/map_images/map_L5-P5-P5-P4-P2.png';
import Map_L5_P5_P5_P4_P3 from '../assets/map_images/map_L5-P5-P5-P4-P3.png';
import Map_L5_P5_P5_P5_P1 from '../assets/map_images/map_L5-P5-P5-P5-P1.png';
import Map_L5_P5_P5_P5_P2 from '../assets/map_images/map_L5-P5-P5-P5-P2.png';
import Map_L6_P5_P4_P3_P3_P1 from '../assets/map_images/map_L6-P5-P4-P3-P3-P1.png';
import Map_L6_P5_P4_P3_P3_P2 from '../assets/map_images/map_L6-P5-P4-P3-P3-P2.png';
import Map_L6_P5_P4_P3_P3_P3 from '../assets/map_images/map_L6-P5-P4-P3-P3-P3.png';
import Map_L6_P5_P4_P3_P3_P4 from '../assets/map_images/map_L6-P5-P4-P3-P3-P4.png';
import Map_L6_P5_P4_P3_P3_P5 from '../assets/map_images/map_L6-P5-P4-P3-P3-P5.png';



const initialLayout = { width: Dimensions.get('window').width };
import RNPickerSelect from 'react-native-picker-select';
import { Alert } from 'react-native'; // Import the Alert component
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import ImageZoom from 'react-native-image-pan-zoom';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Home = () => {
  const [siteOptionsV2, setSiteOptions] = useState([]);
  const [selectedSite, setSelectedSite] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [coordsDictV2, setCoordsDict] = useState({});
  const [contactDetailsV3, setContactDetails] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [observedData, setObservedData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isCamModalVisible, setCamModalVisible] = useState(false);
  const [isPickerModalVisible, setPickerModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState(null);
  const [delayedData, setDelayedData] = useState([]);
  const [currentMapKey, setCurrentMapKey] = useState('map_L1'); // Track map level

  useEffect(() => {
    if (isImageModalVisible) {
      setCurrentMapKey('map_L1');
      setSelectedImage(Map_L1);
    }
  }, [isImageModalVisible]);
  

  const renderPickerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pickerItem}
      onPress={() => {
        setSelectedSite(item.match(/\(([^)]+)\)/)?.[1]);
        setPickerModalVisible(false);
      }}>
      <Text style={styles.pickerText}>{item}</Text>
    </TouchableOpacity>
  )
  const [selectedImage, setSelectedImage] = useState(null);

// Unified map navigation tree for flexible navigation
const map_tree = {
  map_L1: {
    image: Map_L1,
    children: [
      { area: { x: [80, 109], y: [302, 336] }, key: 'map_L2_P1' },
      { area: { x: [63, 77], y: [220, 238] }, key: 'map_L2_P2' },
      { area: { x: [76, 114], y: [166, 210] }, key: 'map_L2_P3' },
      { area: { x: [127, 167], y: [113, 149] }, key: 'map_L2_P4' },
      { area: { x: [149, 238], y: [39, 134] }, key: 'map_L2_P5' },
      { area: { x: [228, 267], y: [35, 64] }, key: 'map_L2_P6' }
    ]
  },
  map_L2_P1: {
    image: Map_L2_P1,
    back: 'map_L1',
    children: [
      { area: { x: [119, 154], y: [286, 330] }, key: 'map_L3_P1_P1' },
      { area: { x: [101, 145], y: [112, 238] }, key: 'map_L3_P1_P2' },
      { area: { x: [97, 131], y: [50, 85] }, key: 'map_L3_P1_P3' }
    ]
  },
  map_L3_P1_P1: {
    image: Map_L3_P1_P1,
    back: 'map_L2_P1',
    children: [
      { area: { x: [125, 152], y: [309, 336] }, key: 'CAM001', isSite: true },
      { area: { x: [122, 157], y: [257, 291] }, key: 'CAM002', isSite: true },
      { area: { x: [112, 158], y: [204, 245] }, key: 'CAM003', isSite: true },
      { area: { x: [106, 149], y: [160, 191] }, key: 'CAM004', isSite: true },
      { area: { x: [117, 150], y: [109, 143] }, key: 'CAM005', isSite: true },
      { area: { x: [109, 141], y: [72, 102] }, key: 'CAM006', isSite: true }
    ]
  },
  map_L3_P1_P2: {
    image: Map_L3_P1_P2,
    back: 'map_L2_P1',
    children: [
      { area: { x: [143, 188], y: [271, 345] }, key: 'map_L4_P1_P2_P1' },
      { area: { x: [137, 183], y: [222, 271] }, key: 'map_L4_P1_P2_P2' },
      { area: { x: [134, 172], y: [162, 216] }, key: 'map_L4_P1_P2_P3' },
      { area: { x: [126, 164], y: [106, 145] }, key: 'map_L4_P1_P2_P4' },
      { area: { x: [120, 162], y: [42, 98] }, key: 'map_L4_P1_P2_P5' }
    ]
  },
  map_L3_P1_P3: {
    image: Map_L3_P1_P3,
    back: 'map_L2_P1',
    children: [
      { area: { x: [125, 203], y: [258, 333] },key: 'CAM027', isSite: true },
      { area: { x: [108, 158], y: [87, 133] }, key: 'CAM028', isSite: true }
    ]
    
  },
  map_L4_P1_P2_P1: {
    image: Map_L4_P1_P2_P1,
    back: 'map_L3_P1_P2',
    children: [
      { area: { x: [102, 138], y: [266, 300] }, key: 'CAM031', isSite: true },
      { area: { x: [167, 206], y: [258, 294] }, key: 'CAM007', isSite: true },
      { area: { x: [151, 184], y: [190, 225] }, key: 'CAM008', isSite: true },
      { area: { x: [135, 179], y: [107, 140] }, key: 'CAM010', isSite: true },
      { area: { x: [122, 161], y: [43, 76] }, key: 'CAM030', isSite: true }
    ]
  },
  map_L4_P1_P2_P2: {
    image: Map_L4_P1_P2_P2,
    back: 'map_L3_P1_P2',
    children: [
      { area: { x: [130, 170], y: [314, 345] }, key: 'CAM011', isSite: true },
      { area: { x: [122, 160], y: [217, 247] }, key: 'CAM012', isSite: true },
      { area: { x: [114, 150], y: [155, 179] }, key: 'CAM013', isSite: true },
      { area: { x: [111, 138], y: [61, 90] }, key: 'CAM014', isSite: true }
    ]
  },
  map_L4_P1_P2_P3: {
    image: Map_L4_P1_P2_P3,
    back: 'map_L3_P1_P2',
    children: [
      { area: { x: [104, 130], y: [289, 324] }, key: 'CAM016', isSite: true },
      { area: { x: [95, 129], y: [230, 264] }, key: 'CAM017', isSite: true },
      { area: { x: [85, 117], y: [116, 161] }, key: 'CAM019', isSite: true }
    ]
  },
  map_L4_P1_P2_P4: {
    image: Map_L4_P1_P2_P4,
    back: 'map_L3_P1_P2',
    children: [
      { area: { x: [196, 241], y: [274, 308] }, key: 'CAM021', isSite: true },
      { area: { x: [194, 223], y: [213, 253] }, key: 'CAM022', isSite: true },
      { area: { x: [180, 208], y: [127, 166] }, key: 'CAM023', isSite: true },
      { area: { x: [19, 60], y: [203, 239] }, key: 'CAM029', isSite: true }
    ]
  },
  map_L4_P1_P2_P5: {
    image: Map_L4_P1_P2_P5,
    back: 'map_L3_P1_P2',
    children: [
      { area: { x: [92, 146], y: [253, 295] }, key: 'CAM017', isSite: true },
      { area: { x: [102, 132], y: [131, 175] }, key: 'CAM018', isSite: true },
      { area: { x: [94, 121], y: [78, 116] }, key: 'CAM019', isSite: true }
    ]
  },

  map_L2_P2: {
    image: Map_L2_P2,
    back: 'map_L1',
    children: [
      { area: { x: [157, 177], y: [186, 216] }, key: 'map_L3_P2_P1' },
      { area: { x: [126, 144], y: [109, 147] }, key: 'map_L3_P2_P2' }
    ]
  },
  map_L3_P2_P1: {
    image: Map_L3_P2_P1,
    back: 'map_L2_P2',
    children: [
      { area: { x: [124, 177], y: [161, 210] }, key: 'KLE001', isSite: true }
    ]
  },
  map_L3_P2_P2: {
    image: Map_L3_P2_P2,
    back: 'map_L2_P2',
    children: [
      { area: { x: [207, 256], y: [227, 264] }, key: 'KLE004', isSite: true },
      { area: { x: [125, 181], y: [178, 223] }, key: 'KLE003', isSite: true },
      { area: { x: [64, 112], y: [139, 174] }, key: 'KLE002', isSite: true }
    ]
  },

  map_L2_P3: {
    image: Map_L2_P3,
    back: 'map_L1',
    children: [
      { area: { x: [128, 188], y: [217, 326] }, key: 'map_L3_P3_P1' },
      { area: { x: [62, 112], y: [136, 244] }, key: 'map_L3_P3_P2' },
      { area: { x: [162, 211], y: [140, 188] }, key: 'map_L3_P3_P3' },
      { area: { x: [190, 225], y: [42, 71] }, key: 'map_L3_P3_P4' }
    ]
  },
  map_L3_P3_P1: {
    image: Map_L3_P3_P1,
    back: 'map_L2_P3',
    children: [
      { area: { x: [90, 159], y: [250, 340] }, key: 'map_L4_P3_P1_P1' },
      { area: { x: [120, 190], y: [168, 253] }, key: 'map_L4_P3_P1_P2' },
      { area: { x: [99, 121], y: [195, 227] }, key: 'map_L4_P3_P1_P3' },
      { area: { x: [37, 86], y: [133, 166] }, key: 'map_L4_P3_P1_P4' },
      { area: { x: [0, 34], y: [180, 211] }, key: 'map_L4_P3_P1_P5' },
      { area: { x: [163, 210], y: [90, 152] }, key: 'map_L4_P3_P1_P6' },
      { area: { x: [197, 244], y: [35, 68] }, key: 'map_L4_P3_P1_P7' }
    ]
  },

  map_L4_P3_P1_P1: {
    image: Map_L4_P3_P1_P1,
    back: 'map_L3_P3_P1',
    children: [
      { area: { x: [67, 147], y: [171, 277] }, key: 'map_L5_P3_P1_P1_P1' },
      { area: { x: [104, 169], y: [109, 172] }, key: 'map_L5_P3_P1_P1_P2' },
      { area: { x: [133, 190], y: [32, 97] }, key: 'map_L5_P3_P1_P1_P3' }
    ]
  },

  map_L5_P3_P1_P1_P1: {
    image: Map_L5_P3_P1_P1_P1,
    back: 'map_L4_P3_P1_P1',
    children: [
      { area: { x: [70, 127], y: [318, 347] }, key: 'NUE024', isSite: true },
      { area: { x: [96, 142], y: [240, 278] }, key: 'NUE023', isSite: true },
      { area: { x: [120, 180], y: [155, 196] }, key: 'NUE022', isSite: true },
      { area: { x: [152, 196], y: [55, 93] }, key: 'NUE021', isSite: true }
    ]
  },
  map_L5_P3_P1_P1_P2: {
    image: Map_L5_P3_P1_P1_P2,
    back: 'map_L4_P3_P1_P1',
    children: [
      { area: { x: [85, 137], y: [231, 271] }, key: 'NUE020', isSite: true },
      { area: { x: [119, 192], y: [130, 174] }, key: 'NUE019', isSite: true }
    ]
  },
  map_L5_P3_P1_P1_P3: {
    image: Map_L5_P3_P1_P1_P3,
    back: 'map_L4_P3_P1_P1',
    children: [
      { area: { x: [93, 134], y: [262, 303] }, key: 'NUE018', isSite: true },
      { area: { x: [130, 168], y: [131, 173] }, key: 'NUE017', isSite: true }
    ]
  },
  
  map_L4_P3_P1_P2: {
    image: Map_L4_P3_P1_P2,
    back: 'map_L3_P3_P1',
    children: [
      { area: { x: [28, 152], y: [214, 345] }, key: 'map_L5_P3_P1_P2_P1' },
      { area: { x: [81, 162], y: [116, 207] }, key: 'map_L5_P3_P1_P2_P2' }
    ]
  },

  map_L5_P3_P1_P2_P1: {
    image: Map_L5_P3_P1_P2_P1,
    back: 'map_L4_P3_P1_P2',
    children: [
      { area: { x: [103, 178], y: [296, 346] }, key: 'NUE016', isSite: true },
      { area: { x: [140, 203], y: [196, 247] }, key: 'NUE015', isSite: true },
      { area: { x: [169, 228], y: [84, 136] }, key: 'NUE014', isSite: true }
    ]
  },
  map_L5_P3_P1_P2_P2: {
    image: Map_L5_P3_P1_P2_P2,
    back: 'map_L4_P3_P1_P2',
    children: [
      { area: { x: [103, 153], y: [266, 319] }, key: 'NUE013', isSite: true },
      { area: { x: [135, 189], y: [156, 204] }, key: 'NUE012', isSite: true }
    ]
  },
  
  map_L4_P3_P1_P3: {
    image: Map_L4_P3_P1_P3,
    back: 'map_L3_P3_P1',
    children: [
      { area: { x: [116, 201], y: [183, 249] }, key: 'NUE044', isSite: true }
    ]
  },
  map_L4_P3_P1_P4: {
    image: Map_L4_P3_P1_P4,
    back: 'map_L3_P3_P1',
    children: [
      { area: { x: [99, 168], y: [151, 221] }, key: 'NUE042', isSite: true }
    ]
  },
  map_L4_P3_P1_P5: {
    image: Map_L4_P3_P1_P5,
    back: 'map_L3_P3_P1',
    children: [
      { area: { x: [90, 183], y: [137, 215] }, key: 'NUE043', isSite: true }
    ]
  },
  map_L4_P3_P1_P6: {
    image: Map_L4_P3_P1_P6,
    back: 'map_L3_P3_P1',
    children: [
      { area: { x: [80, 133], y: [314, 345] }, key: 'NUE011', isSite: true },
      { area: { x: [97, 165], y: [254, 296] }, key: 'NUE010', isSite: true },
      { area: { x: [114, 170], y: [186, 238] }, key: 'NUE009', isSite: true },
      { area: { x: [137, 216], y: [120, 173] }, key: 'NUE008', isSite: true },
      { area: { x: [156, 220], y: [57, 107] }, key: 'NUE007', isSite: true }
    ]
  },

  map_L4_P3_P1_P7: {
    image: Map_L4_P3_P1_P7,
    back: 'map_L3_P3_P1',
    children: [
      { area: { x: [122, 189], y: [170, 224] }, key: 'NUE048', isSite: true }
    ]
  },
  

  map_L3_P3_P2: {
    image: Map_L3_P3_P2,
    back: 'map_L2_P3',
    children: [
      { area: { x: [129, 202], y: [267, 332] }, key: 'map_L4_P3_P2_P1' },
      { area: { x: [87, 151], y: [152, 255] }, key: 'map_L4_P3_P2_P2' },
      { area: { x: [89, 139], y: [82, 142] }, key: 'map_L4_P3_P2_P3' },
      { area: { x: [121, 163], y: [49, 77] }, key: 'map_L4_P3_P2_P4' }
    ]
  },
  map_L4_P3_P2_P1: {
    image: Map_L4_P3_P2_P1,
    back: 'map_L3_P3_P2',
    children: [
      { area: { x: [215, 270], y: [235, 277] }, key: 'NUE025', isSite: true },
      { area: { x: [29, 75], y: [106, 149] }, key: 'NUE026', isSite: true }
    ]
  },
    
  map_L4_P3_P2_P2: {
    image: Map_L4_P3_P2_P2,
    back: 'map_L3_P3_P2',
    children: [
      { area: { x: [139, 181], y: [311, 345] }, key: 'map_L5_P3_P2_P2_P1' },
      { area: { x: [74, 114], y: [174, 276] }, key: 'map_L5_P3_P2_P2_P2' },
      { area: { x: [62, 114], y: [114, 163] }, key: 'map_L5_P3_P2_P2_P3' },
      { area: { x: [87, 135], y: [43, 98] }, key: 'map_L5_P3_P2_P2_P4' }
    ]
  },
  
  map_L5_P3_P2_P2_P1: {
    image: Map_L5_P3_P2_P2_P1,
    back: 'map_L4_P3_P2_P2',
    children: [
      { area: { x: [129, 162], y: [288, 317] }, key: 'NUE028', isSite: true },
      { area: { x: [107, 147], y: [181, 222] }, key: 'NUE027', isSite: true },
      { area: { x: [105, 147], y: [70, 113] }, key: 'NUE029', isSite: true }
    ]
  },
  
  map_L5_P3_P2_P2_P2: {
    image: Map_L5_P3_P2_P2_P2,
    back: 'map_L4_P3_P2_P2',
    children: [
      { area: { x: [155, 202], y: [313, 347] }, key: 'NUE030', isSite: true },
      { area: { x: [134, 172], y: [260, 302] }, key: 'NUE031', isSite: true },
      { area: { x: [95, 126], y: [206, 241] }, key: 'NUE032', isSite: true },
      { area: { x: [88, 125], y: [157, 188] }, key: 'NUE033', isSite: true },
      { area: { x: [65, 115], y: [110, 151] }, key: 'NUE034', isSite: true },
      { area: { x: [44, 80], y: [60, 105] }, key: 'NUE035', isSite: true }
    ]
  },
  
  map_L5_P3_P2_P2_P3: {
    image: Map_L5_P3_P2_P2_P3,
    back: 'map_L4_P3_P2_P2',
    children: [
      { area: { x: [97, 140], y: [308, 347] }, key: 'NUE050', isSite: true },
      { area: { x: [91, 125], y: [172, 215] }, key: 'NUE036', isSite: true },
      { area: { x: [92, 148], y: [80, 121] }, key: 'NUE037', isSite: true }
    ]
  },
  
  map_L5_P3_P2_P2_P4: {
    image: Map_L5_P3_P2_P2_P4,
    back: 'map_L4_P3_P2_P2',
    children: [
      { area: { x: [114, 158], y: [268, 306] }, key: 'NUE045', isSite: true },
      { area: { x: [130, 173], y: [189, 230] }, key: 'NUE046', isSite: true },
      { area: { x: [165, 219], y: [101, 141] }, key: 'NUE047', isSite: true }
    ]
  },
  
  
  map_L4_P3_P2_P3: {
    image: Map_L4_P3_P2_P3,
    back: 'map_L3_P3_P2',
    children: [
      { area: { x: [88, 129], y: [288, 323] }, key: 'NUE038', isSite: true },
      { area: { x: [114, 166], y: [230, 269] }, key: 'NUE039', isSite: true },
      { area: { x: [136, 180], y: [163, 201] }, key: 'NUE040', isSite: true },
      { area: { x: [158, 214], y: [103, 139] }, key: 'NUE041', isSite: true }
    ]
  },
  
  map_L4_P3_P2_P4: {
    image: Map_L4_P3_P2_P4,
    back: 'map_L3_P3_P2',
    children: [
      { area: { x: [98, 158], y: [163, 211] }, key: 'SAN001', isSite: true }
    ]
  },
  
  map_L3_P3_P3: {
    image: Map_L3_P3_P3,
    back: 'map_L2_P3',
    children: [
      { area: { x: [121, 238], y: [163, 300] }, key: 'map_L4_P3_P3_P1' },
      { area: { x: [80, 116], y: [52, 88] }, key: 'map_L4_P3_P3_P2' }
    ]
  },

  map_L4_P3_P3_P1: {
    image: Map_L4_P3_P3_P1,
    back: 'map_L3_P3_P3',
    children: [
      { area: { x: [117, 166], y: [176, 286] }, key: 'map_L5_P3_P3_P1_P1' },
      { area: { x: [183, 236], y: [64, 183] }, key: 'map_L5_P3_P3_P1_P2' }
    ]
  },
  
  map_L5_P3_P3_P1_P1: {
    image: Map_L5_P3_P3_P1_P1,
    back: 'map_L4_P3_P3_P1',
    children: [
      { area: { x: [58, 100], y: [260, 300] }, key: 'NUE006', isSite: true },
      { area: { x: [158, 202], y: [80, 124] }, key: 'NUE005', isSite: true }
    ]
  },
  
  
  map_L5_P3_P3_P1_P2: {
    image: Map_L5_P3_P3_P1_P2,
    back: 'map_L4_P3_P3_P1',
    children: [
      { area: { x: [48, 99], y: [306, 345] }, key: 'NUE004', isSite: true },
      { area: { x: [84, 125], y: [237, 280] }, key: 'NUE003', isSite: true },
      { area: { x: [128, 182], y: [150, 191] }, key: 'NUE002', isSite: true },
      { area: { x: [176, 228], y: [93, 143] }, key: 'NUE001', isSite: true }
    ]
  },
  
  
  map_L4_P3_P3_P2: {
    image: Map_L4_P3_P3_P2,
    back: 'map_L3_P3_P3',
    children: [
      { area: { x: [132, 179], y: [129, 174] }, key: 'NUE049', isSite: true }
    ]
  },
  
  map_L3_P3_P4: {
    image: Map_L3_P3_P4,
    back: 'map_L2_P3',
    children: [
      { area: { x: [86, 114], y: [179, 208] }, key: 'map_L4_P3_P4_P1' },
      { area: { x: [111, 188], y: [137, 202] }, key: 'map_L4_P3_P4_P2' },
      { area: { x: [199, 241], y: [107, 143] }, key: 'map_L4_P3_P4_P3' }
    ]
  },
  
  map_L4_P3_P4_P1: {
    image: Map_L4_P3_P4_P1,
    back: 'map_L3_P3_P4',
    children: [
      { area: { x: [119, 190], y: [162, 209] }, key: 'ARA001', isSite: true }
    ]
  },
  map_L4_P3_P4_P2: {
    image: Map_L4_P3_P4_P2,
    back: 'map_L3_P3_P4',
    children: [
      { area: { x: [177, 233], y: [189, 240] }, key: 'ARA002', isSite: true },
      { area: { x: [39, 100], y: [133, 183] }, key: 'ARA004', isSite: true }
    ]
  },
  map_L4_P3_P4_P3: {
    image: Map_L4_P3_P4_P3,
    back: 'map_L3_P3_P4',
    children: [
      { area: { x: [105, 184], y: [154, 213] }, key: 'ARA003', isSite: true }
    ]
  },
   
  map_L2_P4: {
    image: Map_L2_P4,
    back: 'map_L1',
    children: [
      { area: { x: [258, 313], y: [165, 214] }, key: 'map_L3_P4_P1' },
      { area: { x: [91, 129], y: [68, 99] }, key: 'map_L3_P4_P2' },
      { area: { x: [287, 347], y: [286, 345] }, key: 'map_L1' }
    ]
  },

  map_L3_P4_P1: {
    image: Map_L3_P4_P1,
    back: 'map_L2_P4',
    children: [
      { area: { x: [31, 72], y: [268, 311] }, key: 'MAT003', isSite: true },
      { area: { x: [103, 140], y: [210, 259] }, key: 'MAT004', isSite: true },
      { area: { x: [193, 247], y: [145, 190] }, key: 'MAT005', isSite: true },
      { area: { x: [283, 326], y: [75, 131] }, key: 'MAT006', isSite: true }
    ]
  },

  map_L3_P4_P2: {
    image: Map_L3_P4_P2,
    back: 'map_L2_P4',
    children: [
      { area: { x: [176, 221], y: [197, 246] }, key: 'MAT002', isSite: true },
      { area: { x: [40, 83], y: [150, 209] }, key: 'MAT001', isSite: true }
    ]
  },
 

  map_L2_P5: {
    image: Map_L2_P5,
    back: 'map_L1',
    children: [
      { area: { x: [71, 115], y: [315, 349] }, key: 'map_L3_P5_P1' },
      { area: { x: [121, 174], y: [260, 315] }, key: 'map_L3_P5_P2' },
      { area: { x: [157, 206], y: [221, 274] }, key: 'map_L3_P5_P3' },
      { area: { x: [190, 264], y: [172, 234] }, key: 'map_L3_P5_P4' },
      { area: { x: [229, 313], y: [94, 182] }, key: 'map_L3_P5_P5' },
      { area: { x: [175, 215], y: [66, 107] }, key: 'map_L3_P5_P6' },
      { area: { x: [287, 347], y: [286, 345] }, key: 'map_L1' }
    ]
  },
  map_L3_P5_P1: {
    image: Map_L3_P5_P1,
    back: 'map_L2_P5',
    children: [
      { area: { x: [12, 60], y: [287, 332] }, key: 'MAT003', isSite: true },
      { area: { x: [97, 142], y: [222, 272] }, key: 'MAT004', isSite: true },
      { area: { x: [183, 232], y: [159, 209] }, key: 'MAT005', isSite: true },
      { area: { x: [273, 315], y: [93, 146] }, key: 'MAT006', isSite: true }
    ]
  },
    
  map_L3_P5_P2: {
    image: Map_L3_P5_P2,
    back: 'map_L2_P5',
    children: [
      { area: { x: [8, 59], y: [317, 347] }, key: 'map_L4_P5_P2_P1' },
      { area: { x: [63, 135], y: [229, 302] }, key: 'map_L4_P5_P2_P2' },
      { area: { x: [110, 178], y: [165, 235] }, key: 'map_L4_P5_P2_P3' },
      { area: { x: [155, 215], y: [107, 174] }, key: 'map_L4_P5_P2_P4' },
      { area: { x: [200, 260], y: [63, 109] }, key: 'map_L4_P5_P2_P5' },
      { area: { x: [244, 287], y: [27, 60] }, key: 'map_L4_P5_P2_P6' }
    ]
  },

  map_L4_P5_P2_P1: {
    image: Map_L4_P5_P2_P1,
    back: 'map_L3_P5_P2',
    children: [
      { area: { x: [116, 175], y: [161, 225] }, key: 'BRA002', isSite: true }
    ]
  },

  map_L4_P5_P2_P2: {
    image: Map_L4_P5_P2_P2,
    back: 'map_L3_P5_P2',
    children: [
      { area: { x: [53, 100], y: [299, 348] }, key: 'BRA004', isSite: true },
      { area: { x: [113, 172], y: [239, 298] }, key: 'BRA005', isSite: true },
      { area: { x: [178, 218], y: [161, 212] }, key: 'BRA006', isSite: true },
      { area: { x: [210, 258], y: [76, 126] }, key: 'BRA007', isSite: true }
    ]
  },
  

  map_L4_P5_P2_P3: {
    image: Map_L4_P5_P2_P3,
    back: 'map_L3_P5_P2',
    children: [
      { area: { x: [35, 89], y: [304, 345] }, key: 'BRA008', isSite: true },
      { area: { x: [93, 155], y: [212, 263] }, key: 'BRA009', isSite: true },
      { area: { x: [158, 215], y: [102, 154] }, key: 'BRA010', isSite: true }
    ]
  },

  map_L4_P5_P2_P4: {
    image: Map_L4_P5_P2_P4,
    back: 'map_L3_P5_P2',
    children: [
      { area: { x: [48, 109], y: [310, 348] }, key: 'BRA011', isSite: true },
      { area: { x: [82, 131], y: [260, 307] }, key: 'BRA012', isSite: true },
      { area: { x: [204, 253], y: [82, 121] }, key: 'BRA013', isSite: true }
    ]
  },

  map_L4_P5_P2_P5: {
    image: Map_L4_P5_P2_P5,
    back: 'map_L3_P5_P2',
    children: [
      { area: { x: [67, 132], y: [252, 302] }, key: 'BRA014', isSite: true },
      { area: { x: [146, 203], y: [145, 191] }, key: 'BRA015', isSite: true }
    ]
  },

  map_L4_P5_P2_P6: {
    image: Map_L4_P5_P2_P6,
    back: 'map_L3_P5_P2',
    children: [
      { area: { x: [135, 196], y: [154, 209] }, key: 'BRA016', isSite: true }
    ]
  },
  

  map_L3_P5_P3: {
    image: Map_L3_P5_P3,
    back: 'map_L2_P5',
    children: [
      { area: { x: [97, 179], y: [248, 330] }, key: 'map_L4_P5_P3_P1' },
      { area: { x: [161, 219], y: [196, 247] }, key: 'map_L4_P5_P3_P2' },
      { area: { x: [207, 322], y: [82, 179] }, key: 'map_L4_P5_P3_P3' }
    ]
  },

  map_L4_P5_P3_P1: {
    image: Map_L4_P5_P3_P1,
    back: 'map_L3_P5_P3',
    children: [
      { area: { x: [69, 159], y: [248, 309] }, key: 'BRA017', isSite: true },
      { area: { x: [156, 223], y: [157, 207] }, key: 'BRA018', isSite: true }
    ]
  },
  
  map_L4_P5_P3_P2: {
    image: Map_L4_P5_P3_P2,
    back: 'map_L3_P5_P3',
    children: [
      { area: { x: [135, 205], y: [165, 227] }, key: 'GAL001', isSite: true }
    ]
  },
  
  map_L4_P5_P3_P3: {
    image: Map_L4_P5_P3_P3,
    back: 'map_L3_P5_P3',
    children: [
      { area: { x: [39, 103], y: [305, 349] }, key: 'GAL003', isSite: true },
      { area: { x: [126, 195], y: [208, 259] }, key: 'GAL005', isSite: true },
      { area: { x: [212, 268], y: [105, 161] }, key: 'GAL007', isSite: true }
    ]
  },
  

  map_L3_P5_P4: {
    image: Map_L3_P5_P4,
    back: 'map_L2_P5',
    children: [
      { area: { x: [1, 136], y: [219, 346] }, key: 'map_L4_P5_P4_P1' },
      { area: { x: [108, 168], y: [193, 243] }, key: 'map_L4_P5_P4_P2' },
      { area: { x: [147, 295], y: [76, 219] }, key: 'map_L4_P5_P4_P3' },
      { area: { x: [279, 336], y: [36, 91] }, key: 'map_L4_P5_P4_P4' }
    ]
  },

map_L4_P5_P4_P1: {
  image: Map_L4_P5_P4_P1,
  back: 'map_L3_P5_P4',
  children: [
    { area: { x: [0, 80], y: [266, 348] }, key: 'map_L5_P5_P4_P1_P1' },
    { area: { x: [68, 175], y: [183, 285] }, key: 'map_L5_P5_P4_P1_P2' },
    { area: { x: [163, 263], y: [96, 201] }, key: 'map_L5_P5_P4_P1_P3' },
    { area: { x: [257, 344], y: [17, 109] }, key: 'map_L5_P5_P4_P1_P4' },
    { area: { x: [101, 141], y: [67, 114] }, key: 'map_L5_P5_P4_P1_P5' }
  ]
},

  map_L5_P5_P4_P1_P1: {
    image: Map_L5_P5_P4_P1_P1,
    back: 'map_L4_P5_P4_P1',
    children: [
      { area: { x: [37, 102], y: [236, 301] }, key: 'GAL013', isSite: true },
      { area: { x: [238, 313], y: [51, 115] }, key: 'GAL014', isSite: true }
    ]
  },
  map_L5_P5_P4_P1_P2: {
    image: Map_L5_P5_P4_P1_P2,
    back: 'map_L4_P5_P4_P1',
    children: [
      { area: { x: [51, 112], y: [268, 319] }, key: 'GAL017', isSite: true },
      { area: { x: [168, 223], y: [155, 211] }, key: 'GAL019', isSite: true },
      { area: { x: [275, 339], y: [59, 117] }, key: 'GAL022', isSite: true }
    ]
  },
  map_L5_P5_P4_P1_P3: {
    image: Map_L5_P5_P4_P1_P3,
    back: 'map_L4_P5_P4_P1',
    children: [
      { area: { x: [28, 92], y: [270, 327] }, key: 'GAL023', isSite: true },
      { area: { x: [104, 174], y: [202, 257] }, key: 'GAL024', isSite: true },
      { area: { x: [247, 316], y: [61, 115] }, key: 'GAL025', isSite: true }
    ]
  },
  map_L5_P5_P4_P1_P4: {
    image: Map_L5_P5_P4_P1_P4,
    back: 'map_L4_P5_P4_P1',
    children: [
      { area: { x: [45, 116], y: [254, 311] }, key: 'GAL026', isSite: true },
      { area: { x: [131, 192], y: [149, 207] }, key: 'GAL027', isSite: true },
      { area: { x: [222, 296], y: [93, 146] }, key: 'GAL028', isSite: true }
    ]
  },
  map_L5_P5_P4_P1_P5: {
    image: Map_L5_P5_P4_P1_P5,
    back: 'map_L4_P5_P4_P1',
    children: [
      { area: { x: [137, 240], y: [151, 217] }, key: 'GAL021', isSite: true }
    ]
  },


  map_L4_P5_P4_P2: {
    image: Map_L4_P5_P4_P2,
    back: 'map_L3_P5_P4',
    children: [
      { area: { x: [73, 120], y: [245, 297] }, key: 'GAL030', isSite: true },
      { area: { x: [247, 323], y: [74, 132] }, key: 'GAL032', isSite: true }
    ]
  },

  map_L4_P5_P4_P3: {
    image: Map_L4_P5_P4_P3,
    back: 'map_L3_P5_P4',
    children: [
      { area: { x: [32, 94], y: [283, 343] }, key: 'map_L5_P5_P4_P3_P1' },
      { area: { x: [75, 127], y: [261, 295] }, key: 'map_L5_P5_P4_P3_P2' },
      { area: { x: [109, 281], y: [101, 279] }, key: 'map_L5_P5_P4_P3_P3' },
      { area: { x: [256, 318], y: [48, 118] }, key: 'map_L5_P5_P4_P3_P4' }
    ]
  },

  map_L5_P5_P4_P3_P1: {
    image: Map_L5_P5_P4_P3_P1,
    back: 'map_L4_P5_P4_P3',
    children: [
      { area: { x: [56, 120], y: [234, 297] }, key: 'GAL083', isSite: true },
      { area: { x: [234, 288], y: [77, 127] }, key: 'GAL084', isSite: true }
    ]
  },
  map_L5_P5_P4_P3_P2: {
    image: Map_L5_P5_P4_P3_P2,
    back: 'map_L4_P5_P4_P3',
    children: [
      { area: { x: [142, 211], y: [149, 204] }, key: 'GAL085', isSite: true }
    ]
  },
  map_L5_P5_P4_P3_P3: {
    image: Map_L5_P5_P4_P3_P3,
    back: 'map_L4_P5_P4_P3',
    children: [
      { area: { x: [10, 76], y: [290, 347] }, key: 'map_L6_P5_P4_P3_P3_P1' },
      { area: { x: [54, 140], y: [234, 321] }, key: 'map_L6_P5_P4_P3_P3_P2' },
      { area: { x: [120, 224], y: [153, 260] }, key: 'map_L6_P5_P4_P3_P3_P3' },
      { area: { x: [206, 264], y: [104, 170] }, key: 'map_L6_P5_P4_P3_P3_P4' },
      { area: { x: [240, 322], y: [40, 124] }, key: 'map_L6_P5_P4_P3_P3_P5' }
    ]
  },

  map_L6_P5_P4_P3_P3_P1: {
    image: Map_L6_P5_P4_P3_P3_P1,
    back: 'map_L5_P5_P4_P3_P3',
    children: [
      { area: { x: [82, 137], y: [201, 258] }, key: 'GAL034', isSite: true },
      { area: { x: [195, 256], y: [93, 143] }, key: 'GAL035', isSite: true }
    ]
  },
  map_L6_P5_P4_P3_P3_P2: {
    image: Map_L6_P5_P4_P3_P3_P2,
    back: 'map_L5_P5_P4_P3_P3',
    children: [
      { area: { x: [14, 78], y: [266, 309] }, key: 'GAL036', isSite: true },
      { area: { x: [130, 202], y: [134, 183] }, key: 'GAL037', isSite: true },
      { area: { x: [246, 310], y: [55, 105] }, key: 'GAL038', isSite: true }
    ]
  },
  map_L6_P5_P4_P3_P3_P3: {
    image: Map_L6_P5_P4_P3_P3_P3,
    back: 'map_L5_P5_P4_P3_P3',
    children: [
      { area: { x: [55, 109], y: [292, 342] }, key: 'GAL039', isSite: true },
      { area: { x: [106, 167], y: [234, 281] }, key: 'GAL040', isSite: true },
      { area: { x: [181, 243], y: [167, 211] }, key: 'GAL041', isSite: true },
      { area: { x: [255, 316], y: [86, 136] }, key: 'GAL042', isSite: true }
    ]
  },
  map_L6_P5_P4_P3_P3_P4: {
    image: Map_L6_P5_P4_P3_P3_P4,
    back: 'map_L5_P5_P4_P3_P3',
    children: [
      { area: { x: [77, 140], y: [232, 286] }, key: 'GAL044', isSite: true },
      { area: { x: [173, 232], y: [108, 162] }, key: 'GAL045', isSite: true }
    ]
  },
  map_L6_P5_P4_P3_P3_P5: {
    image: Map_L6_P5_P4_P3_P3_P5,
    back: 'map_L5_P5_P4_P3_P3',
    children: [
      { area: { x: [38, 94], y: [273, 329] }, key: 'GAL046', isSite: true },
      { area: { x: [208, 280], y: [55, 109] }, key: 'GAL047', isSite: true }
    ]
  },

  map_L5_P5_P4_P3_P4: {
    image: Map_L5_P5_P4_P3_P4,
    back: 'map_L4_P5_P4_P3',
    children: [
      { area: { x: [71, 119], y: [256, 314] }, key: 'GAL048', isSite: true },
      { area: { x: [139, 192], y: [189, 243] }, key: 'GAL049', isSite: true },
      { area: { x: [203, 256], y: [115, 159] }, key: 'GAL050', isSite: true }
    ]
  },


  map_L4_P5_P4_P4: {
    image: Map_L4_P5_P4_P4,
    back: 'map_L3_P5_P4',
    children: [
      { area: { x: [103, 142], y: [216, 268] }, key: 'GAL053', isSite: true },
      { area: { x: [194, 253], y: [120, 171] }, key: 'GAL055', isSite: true }
    ]
  },

  map_L3_P5_P5: {
    image: Map_L3_P5_P5,
    back: 'map_L2_P5',
    children: [
      { area: { x: [0, 35], y: [306, 344] }, key: 'map_L4_P5_P5_P1' },
      { area: { x: [68, 105], y: [300, 333] }, key: 'map_L4_P5_P5_P2' },
      { area: { x: [73, 150], y: [234, 297] }, key: 'map_L4_P5_P5_P3' },
      { area: { x: [136, 203], y: [192, 258] }, key: 'map_L4_P5_P5_P4' },
      { area: { x: [206, 275], y: [142, 197] }, key: 'map_L4_P5_P5_P5' }
    ]
  },
  
    
  map_L4_P5_P5_P1: {
    image: Map_L4_P5_P5_P1,
    back: 'map_L3_P5_P5',
    children: [
      { area: { x: [120, 186], y: [116, 176] }, key: 'GAL082', isSite: true }
    ]
  },

  map_L4_P5_P5_P2: {
    image: Map_L4_P5_P5_P2,
    back: 'map_L3_P5_P5',
    children: [
      { area: { x: [110, 200], y: [140, 222] }, key: 'GAL058', isSite: true }
    ]
  },

  map_L4_P5_P5_P3: {
    image: Map_L4_P5_P5_P3,
    back: 'map_L3_P5_P5',
    children: [
      { area: { x: [28, 87], y: [306, 347] }, key: 'GAL059', isSite: true },
      { area: { x: [108, 166], y: [179, 242] }, key: 'GAL061', isSite: true },
      { area: { x: [212, 271], y: [69, 127] }, key: 'GAL062', isSite: true }
    ]
  },



  map_L4_P5_P5_P4: {
    image: Map_L4_P5_P5_P4,
    back: 'map_L3_P5_P5',
    children: [
      { area: { x: [18, 174], y: [174, 305]}, key: 'map_L5_P5_P5_P4_P1' },
      { area: { x: [148, 238], y: [124, 204] }, key: 'map_L5_P5_P5_P4_P2' },
      { area: { x:  [223, 282], y: [94, 155]}, key: 'map_L5_P5_P5_P4_P3' },
    ]
  },

  map_L5_P5_P5_P4_P1: {
    image: Map_L5_P5_P5_P4_P1,
    back: 'map_L4_P5_P5_P4',
    children: [
      { area: { x: [15, 79], y: [282, 334] }, key: 'GAL064', isSite: true },
      { area: { x: [96, 157], y: [214, 264] }, key: 'GAL065', isSite: true },
      { area: { x: [172, 239], y: [135, 195] }, key: 'GAL066', isSite: true },
      { area: { x: [253, 319], y: [72, 131] }, key: 'GAL067', isSite: true }
    ]
  },

  map_L5_P5_P5_P4_P2: {
    image: Map_L5_P5_P5_P4_P2,
    back: 'map_L4_P5_P5_P4',
    children: [
      { area: { x: [49, 109], y: [248, 315] }, key: 'GAL068', isSite: true },
      { area: { x: [209, 273], y: [122, 190] }, key: 'GAL069', isSite: true }
    ]
  },

  map_L5_P5_P5_P4_P3: {
    image: Map_L5_P5_P5_P4_P3,
    back: 'map_L4_P5_P5_P4',
    children: [
      { area: { x: [134, 204], y: [179, 252] }, key: 'GAL070', isSite: true }
    ]
  },


  map_L4_P5_P5_P5: {
    image: Map_L4_P5_P5_P5,
    back: 'map_L3_P5_P5',
    children: [
      { area: { x: [53, 150], y: [202, 286] }, key: 'map_L5_P5_P5_P5_P1' },
      { area: { x:[153, 243], y: [124, 222]  }, key: 'map_L5_P5_P5_P5_P2' }
    ]
  },


  map_L5_P5_P5_P5_P1: {
    image: Map_L5_P5_P5_P5_P1,
    back: 'map_L4_P5_P5_P5',
    children: [
      { area: { x: [61, 136], y: [217, 278] }, key: 'GAL072', isSite: true },
      { area: { x: [209, 285], y: [111, 171] }, key: 'GAL073', isSite: true }
    ]
  },

  map_L5_P5_P5_P5_P2: {
    image: Map_L5_P5_P5_P5_P2,
    back: 'map_L4_P5_P5_P5',
    children: [
      { area: { x: [18, 75], y: [256, 311] }, key: 'GAL074', isSite: true },
      { area: { x: [94, 154], y: [215, 267] }, key: 'GAL075', isSite: true },
      { area: { x: [156, 213], y: [166, 214] }, key: 'GAL076', isSite: true },
      { area: { x: [216, 280], y: [111, 173] }, key: 'GAL077', isSite: true }
    ]
  },

  map_L3_P5_P6: {
    image: Map_L3_P5_P6,
    back: 'map_L2_P5',
    children: [
      { area: { x: [117, 171], y: [227, 280] }, key: 'HAR002', isSite: true },
      { area: { x: [151, 204], y: [127, 179] }, key: 'HAR001', isSite: true }
    ]
  },
  
  map_L2_P6: {
    image: Map_L2_P6,
    back: 'map_L1',
    children: [
      { area: { x: [21, 235], y: [113, 264] }, key: 'map_L3_P6_P1' },
      { area: { x: [229, 303], y: [91, 161] }, key: 'map_L3_P6_P2' }
    ]
  },
  map_L3_P6_P1: {
    image: Map_L3_P6_P1,
    back: 'map_L2_P6',
    children: [
      { area: { x: [5, 41], y: [256, 295] }, key: 'map_L4_P6_P1_P1' },
      { area: { x: [74, 118], y: [208, 251] }, key: 'map_L4_P6_P1_P2' },
      { area: { x: [125, 267], y: [138, 234] }, key: 'map_L4_P6_P1_P3' },
      { area: { x: [253, 341], y: [102, 164] }, key: 'map_L4_P6_P1_P4' }
    ]
  },

  map_L4_P6_P1_P1: {
    image: Map_L4_P6_P1_P1,
    back: 'map_L3_P6_P1',
    children: [
      { area: { x: [100, 171], y: [181, 244] }, key: 'JEF001', isSite: true }
    ]
  },
  map_L4_P6_P1_P2: {
    image: Map_L4_P6_P1_P2,
    back: 'map_L3_P6_P1',
    children: [
      { area: { x: [91, 181], y: [159, 229] }, key: 'JEF002', isSite: true }
    ]
  },

  map_L4_P6_P1_P3: {
    image: Map_L4_P6_P1_P3,
    back: 'map_L3_P6_P1',
    children: [
      { area: { x: [21, 81], y: [264, 335] }, key: 'JEF003', isSite: true },
      { area: { x: [110, 178], y: [212, 268] }, key: 'JEF004', isSite: true },
      { area: { x: [203, 276], y: [164, 223] }, key: 'JEF005', isSite: true },
      { area: { x: [279, 332], y: [128, 182] }, key: 'JEF006', isSite: true }
    ]
  },
  map_L4_P6_P1_P4: {
    image: Map_L4_P6_P1_P4,
    back: 'map_L3_P6_P1',
    children: [
      { area: { x: [43, 98], y: [231, 292] }, key: 'JEF010', isSite: true },
      { area: { x: [238, 315], y: [117, 182] }, key: 'JEF013', isSite: true }
    ]
  },


  map_L3_P6_P2: {
    image: Map_L3_P6_P2,
    back: 'map_L2_P6',
    children: [
      { area: { x: [16, 100], y: [210, 287] }, key: 'map_L4_P6_P2_P1' },
      { area: { x: [107, 161], y: [199, 250] }, key: 'map_L4_P6_P2_P2' },
      { area: { x: [166, 254], y: [171, 237] }, key: 'map_L4_P6_P2_P3' }
    ]
  },


  map_L4_P6_P2_P1: {
    image: Map_L4_P6_P2_P1,
    back: 'map_L3_P6_P2',
    children: [
      { area: { x: [100, 168], y: [180, 249] }, key: 'JEF011', isSite: true },
      { area: { x: [197, 271], y: [109, 171] }, key: 'JEF008', isSite: true }
    ]
  },

  map_L4_P6_P2_P2: {
    image: Map_L4_P6_P2_P2,
    back: 'map_L3_P6_P2',
    children: [
      { area: { x: [127, 191], y: [151, 221] }, key: 'JEF012', isSite: true }
    ]
  },

  map_L4_P6_P2_P3: {
    image: Map_L4_P6_P2_P3,
    back: 'map_L3_P6_P2',
    children: [
      { area: { x: [55, 109], y: [162, 220] }, key: 'JEF009', isSite: true },
      { area: { x: [218, 285], y: [127, 178] }, key: 'JEF013', isSite: true }
    ]
  },


};

  
    
  
  const imageKeyMap = {
    "map_L1": Map_L1,
    "map_L2_P1": Map_L2_P1,
    "map_L2_P2": Map_L2_P2,
    "map_L2_P3": Map_L2_P3,
    "map_L2_P4": Map_L2_P4,
    "map_L2_P5": Map_L2_P5,
    "map_L2_P6": Map_L2_P6,
    "map_L3_P1_P1": Map_L3_P1_P1,
    "map_L3_P1_P2": Map_L3_P1_P2,
    "map_L3_P1_P3": Map_L3_P1_P3,
    "map_L3_P2_P1": Map_L3_P2_P1,
    "map_L3_P2_P2": Map_L3_P2_P2,
    "map_L3_P3_P1": Map_L3_P3_P1,
    "map_L3_P3_P2": Map_L3_P3_P2,
    "map_L3_P3_P3": Map_L3_P3_P3,
    "map_L3_P3_P4": Map_L3_P3_P4,
    "map_L3_P4_P1": Map_L3_P4_P1,
    "map_L3_P4_P2": Map_L3_P4_P2,
    "map_L3_P5_P1": Map_L3_P5_P1,
    "map_L3_P5_P2": Map_L3_P5_P2,
    "map_L3_P5_P3": Map_L3_P5_P3,
    "map_L3_P5_P4": Map_L3_P5_P4,
    "map_L3_P5_P5": Map_L3_P5_P5,
    "map_L3_P5_P6": Map_L3_P5_P6,
    "map_L3_P6_P1": Map_L3_P6_P1,
    "map_L3_P6_P2": Map_L3_P6_P2,
    "map_L4_P1_P2_P1": Map_L4_P1_P2_P1,
    "map_L4_P1_P2_P2": Map_L4_P1_P2_P2,
    "map_L4_P1_P2_P3": Map_L4_P1_P2_P3,
    "map_L4_P1_P2_P4": Map_L4_P1_P2_P4,
    "map_L4_P1_P2_P5": Map_L4_P1_P2_P5,
    "map_L4_P1_P2_P6": Map_L4_P1_P2_P6,
    "map_L4_P3_P1_P1": Map_L4_P3_P1_P1,
    "map_L4_P3_P1_P2": Map_L4_P3_P1_P2,
    "map_L4_P3_P1_P3": Map_L4_P3_P1_P3,
    "map_L4_P3_P1_P4": Map_L4_P3_P1_P4,
    "map_L4_P3_P1_P5": Map_L4_P3_P1_P5,
    "map_L4_P3_P1_P6": Map_L4_P3_P1_P6,
    "map_L4_P3_P1_P7": Map_L4_P3_P1_P7,
    "map_L4_P3_P2_P1": Map_L4_P3_P2_P1,
    "map_L4_P3_P2_P2": Map_L4_P3_P2_P2,
    "map_L4_P3_P2_P3": Map_L4_P3_P2_P3,
    "map_L4_P3_P2_P4": Map_L4_P3_P2_P4,
    "map_L4_P3_P3_P1": Map_L4_P3_P3_P1,
    "map_L4_P3_P3_P2": Map_L4_P3_P3_P2,
    "map_L4_P3_P4_P1": Map_L4_P3_P4_P1,
    "map_L4_P3_P4_P2": Map_L4_P3_P4_P2,
    "map_L4_P3_P4_P3": Map_L4_P3_P4_P3,

    "map_L4_P5_P2_P1": Map_L4_P5_P2_P1,
    "map_L4_P5_P2_P2": Map_L4_P5_P2_P2,
    "map_L4_P5_P2_P3": Map_L4_P5_P2_P3,
    "map_L4_P5_P2_P4": Map_L4_P5_P2_P4,
    "map_L4_P5_P2_P5": Map_L4_P5_P2_P5,
    "map_L4_P5_P2_P6": Map_L4_P5_P2_P6,
    "map_L4_P5_P3_P1": Map_L4_P5_P3_P1,
    "map_L4_P5_P3_P2": Map_L4_P5_P3_P2,
    "map_L4_P5_P3_P3": Map_L4_P5_P3_P3,
    "map_L4_P5_P4_P1": Map_L4_P5_P4_P1,
    "map_L4_P5_P4_P2": Map_L4_P5_P4_P2,
    "map_L4_P5_P4_P3": Map_L4_P5_P4_P3,
    "map_L4_P5_P4_P4": Map_L4_P5_P4_P4,

    "map_L4_P5_P5_P1": Map_L4_P5_P5_P1,
    "map_L4_P5_P5_P2": Map_L4_P5_P5_P2,
    "map_L4_P5_P5_P3": Map_L4_P5_P5_P3,
    "map_L4_P5_P5_P4": Map_L4_P5_P5_P4,
    "map_L4_P5_P5_P5": Map_L4_P5_P5_P5,
    "map_L4_P6_P1_P1": Map_L4_P6_P1_P1,
    "map_L4_P6_P1_P2": Map_L4_P6_P1_P2,
    "map_L4_P6_P1_P3": Map_L4_P6_P1_P3,
    "map_L4_P6_P1_P4": Map_L4_P6_P1_P4,
    "map_L4_P6_P2_P1": Map_L4_P6_P2_P1,
    "map_L4_P6_P2_P2": Map_L4_P6_P2_P2,
    "map_L4_P6_P2_P3": Map_L4_P6_P2_P3,
  
    "map_L5_P3_P1_P1_P1": Map_L5_P3_P1_P1_P1,
    "map_L5_P3_P1_P1_P2": Map_L5_P3_P1_P1_P2,
    "map_L5_P3_P1_P1_P3": Map_L5_P3_P1_P1_P3,
    "map_L5_P3_P1_P2_P1": Map_L5_P3_P1_P2_P1,
    "map_L5_P3_P1_P2_P2": Map_L5_P3_P1_P2_P2,
    "map_L5_P3_P2_P2_P1": Map_L5_P3_P2_P2_P1,
    "map_L5_P3_P2_P2_P2": Map_L5_P3_P2_P2_P2,
    "map_L5_P3_P2_P2_P3": Map_L5_P3_P2_P2_P3,
    "map_L5_P3_P2_P2_P4": Map_L5_P3_P2_P2_P4,
    "map_L5_P3_P3_P1_P1": Map_L5_P3_P3_P1_P1,
    "map_L5_P3_P3_P1_P2": Map_L5_P3_P3_P1_P2,

    "map_L5_P5_P4_P1_P1": Map_L5_P5_P4_P1_P1,
    "map_L5_P5_P4_P1_P2": Map_L5_P5_P4_P1_P2,
    "map_L5_P5_P4_P1_P3": Map_L5_P5_P4_P1_P3,
    "map_L5_P5_P4_P1_P4": Map_L5_P5_P4_P1_P4,
    "map_L5_P5_P4_P1_P5": Map_L5_P5_P4_P1_P5,

    "map_L5_P5_P4_P3_P1": Map_L5_P5_P4_P3_P1,
    "map_L5_P5_P4_P3_P2": Map_L5_P5_P4_P3_P2,
    "map_L5_P5_P4_P3_P3": Map_L5_P5_P4_P3_P3,
    "map_L5_P5_P4_P3_P4": Map_L5_P5_P4_P3_P4,
   
    "map_L5_P5_P5_P4_P1": Map_L5_P5_P5_P4_P1,
    "map_L5_P5_P5_P4_P2": Map_L5_P5_P5_P4_P2,
    "map_L5_P5_P5_P4_P3": Map_L5_P5_P5_P4_P3,
    "map_L5_P5_P5_P5_P1": Map_L5_P5_P5_P5_P1,
    "map_L5_P5_P5_P5_P2": Map_L5_P5_P5_P5_P2,

    "map_L6_P5_P4_P3_P3_P1": Map_L6_P5_P4_P3_P3_P1,
    "map_L6_P5_P4_P3_P3_P2": Map_L6_P5_P4_P3_P3_P2,
    "map_L6_P5_P4_P3_P3_P3": Map_L6_P5_P4_P3_P3_P3,
    "map_L6_P5_P4_P3_P3_P4": Map_L6_P5_P4_P3_P3_P4,
    "map_L6_P5_P4_P3_P3_P5": Map_L6_P5_P4_P3_P3_P5,

  };
  

  

  const findNextMap = (currentKey, x, y) => {
    const node = map_tree[currentKey];
    if (!node?.children) return null;
    for (const child of node.children) {
      const { x: [x1, x2], y: [y1, y2] } = child.area;
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return child.key;
    }
    return null;
  };

  const getPreviousMap = (currentKey) => map_tree[currentKey]?.back || null;

  const handleMapNavigation = ({ x, y, currentMapKey, setSelectedImage, setCurrentMapKey, setImageModalVisible, setCamModalVisible }) => {
    console.log(`🗺️ handleMapNavigation: clicked at x=${x}, y=${y}, current=${currentMapKey}`);

    const nextKey = findNextMap(currentMapKey, x, y);
    if (nextKey) {
      console.log(`➡️ Navigating to: ${nextKey}`);

      setSelectedImage(map_tree[nextKey].image);
      setCurrentMapKey(nextKey);
      setImageModalVisible(false);
      setCamModalVisible(true);
    }
  };

  const handleBackToParentMap = ({ currentMapKey, setSelectedImage, setCurrentMapKey, setCamModalVisible, setImageModalVisible }) => {
    const parentKey = getPreviousMap(currentMapKey);
    if (parentKey) {
      setSelectedImage(map_tree[parentKey].image);
      setCurrentMapKey(parentKey);
      setCamModalVisible(true);
      setImageModalVisible(false);
      return true;
    }
    return false;
  };

  
  const handleMapPress = React.useCallback((evt) => {
    const { locationX, locationY } = evt.nativeEvent;
  
    handleMapNavigation({
      x: locationX,
      y: locationY,
      currentMapKey,
      setSelectedImage,
      setCurrentMapKey,
      setImageModalVisible,
      setCamModalVisible
    });
  }, [currentMapKey, setSelectedImage, setCurrentMapKey, setImageModalVisible, setCamModalVisible]);
  
  // const handleCamPress = (evt) => {
  //   const { locationX, locationY } = evt.nativeEvent;
  //   console.log(`📌 handleCamPress: x=${locationX}, y=${locationY}`);
  
  //   const imageKey = getImageNameKey(selectedImage);
  //   const touchKey = imageKeyToTouchKey[imageKey];
  //   const touchAreas = specificTouchAreas[touchKey];
  
  //   console.log(`🔍 Selected Image Key: ${touchKey}`);
  //   console.log('Touch Areas:', touchAreas);
  
  //   // 1. Site selection
  //   if (touchAreas) {
  //     for (const area of touchAreas) {
  //       if (
  //         locationX >= area.x[0] && locationX <= area.x[1] &&
  //         locationY >= area.y[0] && locationY <= area.y[1]
  //       ) {
  //         setSelectedSite(area.site);
  //         setCamModalVisible(false);
  //         return;
  //       }
  //     }
  //   }
  
  //   // 2. Navigate deeper
  //   const nextKey = findNextMap(imageKey, locationX, locationY);
  //   if (nextKey) {
  //     setSelectedImage(map_tree[nextKey].image);
  //     setCurrentMapKey(nextKey);
  //     return;
  //   }
  
  //   // 3. Navigate back ONLY IF inside the specific back area
  //   const inBackArea =
  //     locationX >= 285 && locationX <= 345 &&
  //     locationY >= 285 && locationY <= 345;
  
  //   if (inBackArea) {
  //     handleBackToParentMap({
  //       currentMapKey,
  //       setSelectedImage,
  //       setCurrentMapKey,
  //       setCamModalVisible,
  //       setImageModalVisible
  //     });
  //   }
  // };
  
  const handleCamPress = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;
    console.log(`📌 handleCamPress: x=${locationX}, y=${locationY}`);
  
    const currentKey = getImageNameKey(selectedImage);
    const node = map_tree[currentKey];
    const areas = node?.children || [];
  
    for (const area of areas) {
      const [x1, x2] = area.area.x;
      const [y1, y2] = area.area.y;
      if (locationX >= x1 && locationX <= x2 && locationY >= y1 && locationY <= y2) {
        if (area.isSite) {
          console.log(`✅ Site selected: ${area.key}`);
          setSelectedSite(area.key);
          setCamModalVisible(false);
        } else if (map_tree[area.key]) {
          console.log(`➡️ Navigating to sub-map: ${area.key}`);
          setSelectedImage(map_tree[area.key].image);
          setCurrentMapKey(area.key);
        }
        return;
      }
    }
  
    // Handle back area
    const inBackArea = locationX >= 285 && locationX <= 345 && locationY >= 285 && locationY <= 345;
    if (inBackArea) {
      handleBackToParentMap({
        currentMapKey,
        setSelectedImage,
        setCurrentMapKey,
        setCamModalVisible,
        setImageModalVisible
      });
    }
  };
  
  
  

  
  const getImageNameKey = (imgRef) => {
    return Object.entries(imageKeyMap).find(([key, val]) => val === imgRef)?.[0];
  };
  
  

  

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'observed', title: `Observed (${observedData.length})` },
    { key: 'predicted', title: `Predicted (${predictedData.length})` },
  ]);

  const csvToJson = (csv) => {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    return result;
  };

  const fetchCSVData = async (url) => {
    try {
      const response = await axios.get(url);
      return csvToJson(response.data);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      throw error;
    }
  };

  

  const fetchData = async () => {
    try {
      const observed = await fetchCSVData('https://enterococcus.today/waf/TX/others/observed.csv');
      const predicted = await fetchCSVData('https://enterococcus.today/waf/TX/others/predicted.csv');
      const delayed = await fetchCSVData('https://enterococcus.today/waf/TX/others/delayed_data.csv');
  
      setObservedData(observed);
      setPredictedData(predicted);
      setDelayedData(delayed);
  
      setTotalCount(observed.length + predicted.length);
  
      AsyncStorage.setItem('observedData', JSON.stringify(observed));
      AsyncStorage.setItem('predictedData', JSON.stringify(predicted));
      AsyncStorage.setItem('delayedData', JSON.stringify(delayed));
  
      const today = new Date().toISOString().split('T')[0];
      AsyncStorage.setItem('lastFetchDate', today);
    } catch (error) {
      const storedObserved = await AsyncStorage.getItem('observedData');
      const storedPredicted = await AsyncStorage.getItem('predictedData');
      const storedDelayed = await AsyncStorage.getItem('delayedData');
  
      if (storedObserved) setObservedData(JSON.parse(storedObserved));
      if (storedPredicted) setPredictedData(JSON.parse(storedPredicted));
      if (storedDelayed) setDelayedData(JSON.parse(storedDelayed));
    }
  };
  

useEffect(() => {
  const checkAndFetchData = async () => {
    const lastFetchDate = await AsyncStorage.getItem('lastFetchDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastFetchDate !== today) {
      await fetchData();
    } else {
      const storedObserved = await AsyncStorage.getItem('observedData');
      const storedPredicted = await AsyncStorage.getItem('predictedData');
      const storedDelayed = await AsyncStorage.getItem('delayedData');

      let observedData = [];
      let predictedData = [];
      let delayedData = [];

      if (storedObserved) {
        observedData = JSON.parse(storedObserved);
        setObservedData(observedData);
      }

      if (storedPredicted) {
        predictedData = JSON.parse(storedPredicted);
        setPredictedData(predictedData);
      }

      if (storedDelayed) {
        delayedData = JSON.parse(storedDelayed);
        setDelayedData(delayedData);
      }

      setTotalCount(observedData.length + predictedData.length);
    }
  };

  checkAndFetchData();
}, []);


  const ObservedTab = () => (
    <ScrollView>
      {observedData.map((item, idx) => (
        <Text key={idx} style={styles.bulletText}>
          • <Text style={styles.boldText}>{item.site_name} ({item.site_id}) :</Text>
          {' '}The observed count is {item.eCount} cfu/100ml on {item.date} and this count is {' '}
          <Text style={[styles.levelText, { color: item.level === 'MEDIUM' ? 'orange' : item.level === 'HIGH' ? 'red' : 'black' }]}>
            {item.level}
          </Text>
        </Text>
      ))}
    </ScrollView>
  );

  const PredictedTab = () => (
    <ScrollView>
      {predictedData.map((item, idx) => {
        const level = item.eCount < 104 ? '>35' : '>104';
        return (
          <Text key={idx} style={styles.bulletText}>
            • <Text style={styles.boldText}>{item.site_name} ({item.site_id}) :</Text>
            {' '}The count is predicted by {item.model_id} to be {' '}
            <Text style={{ color: level === '>35' ? 'orange' : 'red' }}>
              {level}
            </Text> cfu/100ml on {item.date}
          </Text>
        );
      })}
    </ScrollView>
  );

  const DelayedTab = () => (
    <ScrollView>
      {delayedData.map((item, idx) => (
        <Text key={idx} style={styles.bulletText}>
          • <Text style={styles.boldText}>{item.site_name} ({item.site_id}) :</Text>
          {' '}The last observed data is on {item.last_date}.
        </Text>
      ))}
    </ScrollView>
  );
  

  useEffect(() => {
    setRoutes([
      { key: 'observed', title: `Observed (${observedData.length})` },
      { key: 'predicted', title: `Predicted (${predictedData.length})` },
      { key: 'delayed', title: `Delayed Deliveries (${delayedData.length})` },
    ]);
  }, [observedData, predictedData, delayedData]);
  
  const showDataAlert = () => {
    setIsModalVisible(true);
  };

  const renderScene = SceneMap({
    observed: ObservedTab,
    predicted: PredictedTab,
    delayed: DelayedTab,
  });
  


  useEffect(() => {


    const checkAndFetchData = async (url, storageKey, setDataFunction, postProcess) => {
      console.log('✅ useEffect: Checking cached data vs today');

      const lastFetchDate = await AsyncStorage.getItem(`lastFetchDate-${storageKey}`);
      const today = new Date().toISOString().split('T')[0];
    
      let data;
      if (lastFetchDate !== today) {
        console.log('🔄 Fetching fresh data...');
        try {
          const response = await axios.get(url);
          let content = response.data;
    
          // Handle plain text file (e.g. stations.txt)
          if (storageKey === 'siteOptionsV2') {
            data = content.trim().split('\n').map(line => line.trim());
          } else {
            data = content;
          }
    
          await AsyncStorage.setItem(storageKey, JSON.stringify(data));
          await AsyncStorage.setItem(`lastFetchDate-${storageKey}`, today);
        } catch (error) {
          console.error(`❌ Axios failed for ${storageKey}:`, error.message);
          // Show an alert with the error message
          
          const storedData = await AsyncStorage.getItem(storageKey);
          if (storedData) {
            data = JSON.parse(storedData);
          }
        }
      } else {
        console.log('📦 Using cached data from AsyncStorage');

        const storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          data = JSON.parse(storedData);
        }
      }
    
      if (data) {
        if (postProcess) {
          data = postProcess(data);
        }
        setDataFunction(data);
      }
    };
    
    const processSiteOptions = (siteArray) => {
      if (Array.isArray(siteArray) && siteArray.length > 0) {
        const firstSiteId = siteArray[0].match(/\(([^)]+)\)/)?.[1];
        setSelectedSite(firstSiteId);
        return siteArray;
      } else {
        console.error('❌ Fetched site data is empty or invalid:', siteArray);
        // Show an alert when data is invalid or empty
        // Alert.alert('Error Processing Site Data', 'The site data is empty or invalid.');
        return [];
      }
    };
    
    
    

    checkAndFetchData('https://enterococcus.today/waf/TX/others/stations_3.txt', 'siteOptionsV2', setSiteOptions, processSiteOptions);
    checkAndFetchData('https://enterococcus.today/waf/TX/others/beach_lat_lon.txt', 'coordsDictV2', setCoordsDict);
    checkAndFetchData('https://enterococcus.today/waf/TX/others/contact_details_2.json', 'contactDetailsV3', setContactDetails);

  }, []);

  useEffect(() => {
    if (selectedSite) {
      const imageSrc = `https://enterococcus.today/waf/TX/others/beach_images_2/${selectedSite}.jpg`;
      setImageUrl(imageSrc);
    }
  }, [selectedSite]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={showDataAlert} style={styles.alertButton}>
        <Text style={styles.alertText}>({totalCount}) Alert!</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalView}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}

          />
          <TouchableOpacity
            style={styles.closeButton} processSiteOptions
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={{ color: 'white' }}>OK</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>


      {buttonLayout && (
        <Modal
          visible={isPickerModalVisible}
          onRequestClose={() => setPickerModalVisible(false)}
          transparent={true}
          animationType="fade"
        >
          <SafeAreaView style={[styles.modalContainer, {
            top: buttonLayout.y + buttonLayout.height,
          }]}>
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPressOut={() => setPickerModalVisible(false)}
            >
              <SafeAreaView style={styles.dropdownContainer} onStartShouldSetResponder={() => true}>
                <FlatList
                  data={siteOptionsV2}
                  renderItem={renderPickerItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.dropdownList}
                />
              </SafeAreaView>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}



      <SafeAreaView style={styles.pickerAndDotsContainer}>
        <SafeAreaView style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={() => setPickerModalVisible(true)}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setButtonLayout(layout);
            }}
            style={styles.pickerButton}
          >
            <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
              <Text style={{ color: 'blue', padding: 5 }}>
                {selectedSite ? siteOptionsV2.find(item => item.match(/\(([^)]+)\)/)?.[1] === selectedSite) : 'Select Site'}
              </Text>
            </SafeAreaView>
          </TouchableOpacity>
        </SafeAreaView>
        <TouchableOpacity onPress={() => setImageModalVisible(true)} style={styles.dotsButtonBackground}>
          <ImageBackground
            source={require('../assets/images/map_images/bg.jpg')}
            style={{ width: '130%', height: '100%' }} 
          >
          </ImageBackground>
        </TouchableOpacity>

      </SafeAreaView>

      <Text style={{ marginTop: 30, fontSize: 14, fontWeight: 'bold' }}>Enterococcus Counts</Text>
      {selectedSite && <GraphView siteId={selectedSite} />}


      <Text style={{ marginTop: 30, fontSize: 14, fontWeight: 'bold' }}>Data</Text>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container_data}>
          {selectedSite && <Data90DaysView siteId={selectedSite} />}
        </ScrollView>
      </SafeAreaView>

      <Text style={{ marginTop: 30, fontSize: 14, fontWeight: 'bold' }}>Location</Text>
      <SafeAreaView style={styles.container_location}>
        {selectedSite && coordsDictV2[selectedSite] && (
          <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
            <Text style={{ fontSize: 12 }}>
              <Text style={{ fontWeight: 'bold' }}>Latitude: </Text>
              <Text>{coordsDictV2[selectedSite].lat}</Text>
            </Text>
            <Text style={{ fontSize: 12, paddingLeft: 50 }}>
              <Text style={{ fontWeight: 'bold' }}>Longitude: </Text>
              <Text>{coordsDictV2[selectedSite].long}</Text>
            </Text>
          </SafeAreaView>
        )}

        <SafeAreaView style={styles.container_image}>
          {imageUrl && <Image source={{ uri: imageUrl }} style={styles.imageStyle} />}
        </SafeAreaView>
      </SafeAreaView>

      <Text style={{ marginTop: 30, fontSize: 14, fontWeight: 'bold' }}>Contact</Text>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container_contact}>
          {selectedSite && <ContactDetailsView details={contactDetailsV3[selectedSite]} />}
        </ScrollView>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isImageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <SafeAreaView style={styles.modalView_2}>
          <TouchableOpacity onPress={handleMapPress} style={{ width: '10%', height: '50%', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../assets/map_images/map_L1.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setImageModalVisible(false)} style={styles.closeButton_image}>
            <Text>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>




      <Modal
        animationType="slide"
        transparent={true}
        visible={isCamModalVisible}
        onRequestClose={() => setCamModalVisible(false)}
      >
        <SafeAreaView style={styles.modalView_2}>
          <TouchableOpacity onPress={handleCamPress} style={{ width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center' }}>
            {selectedImage && (
              <Image
                source={selectedImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton_image}
            onPress={() => setCamModalVisible(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
};

export default Home