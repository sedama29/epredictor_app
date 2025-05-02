import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, SafeAreaView, Text, Image, Dimensions, Modal, TouchableOpacity, FlatList, ImageBackground, View } from 'react-native';
import axios from 'axios';
import { styles } from './style/style_home';
import Data90DaysView from './data/Data90DaysView';
import ContactDetailsView from './data/ContactDetailsView';
import GraphView from './Graph/GraphView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, SceneMap } from 'react-native-tab-view';
import MapImage1 from '../assets/images/map_images/JEF.jpg';
import MapImage2 from '../assets/images/map_images/GAL.jpg';
import MapImage3 from '../assets/images/map_images/BRA.jpg';
import MapImage4 from '../assets/images/map_images/NUE.jpg';
import MapImage5 from '../assets/images/map_images/CAM.jpg';
const initialLayout = { width: Dimensions.get('window').width };
import RNPickerSelect from 'react-native-picker-select';
import { Alert } from 'react-native'; // Import the Alert component
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import ImageZoom from 'react-native-image-pan-zoom';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const originalImageWidth = 1228; // replace with actual width
const originalImageHeight = 1157; // replace with actual height
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
  const zoomRef = useRef(null); // <-- Add this at the top inside your Home component
  const openMap = (mapId) => {
    if (mapId === 1) {
      console.log("Clicked Region 1");
      setCurrentMap(require('../assets/images/map_images/map_bottom.png'));
    } else if (mapId === 2) {
      console.log("Clicked Region 2");
      setCurrentMap(require('../assets/images/map_images/map_bottom_2.png'));
    } else if (mapId === 3) {
      console.log("Clicked Region 3");
      setCurrentMap(require('../assets/images/map_images/map_top_3.png'));
    }
  };
  

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

  const touchAreas = [
    { x: [130, 150], y: [320, 340], image: MapImage5 },
    { x: [125, 145], y: [205, 225], image: MapImage4 },
    { x: [240, 260], y: [105, 125], image: MapImage3 },
    { x: [265, 285], y: [85, 105], image: MapImage2 },
    { x: [310, 330], y: [55, 75], image: MapImage1 },
  ];

  const handleMapPress = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;
    for (const touchArea of touchAreas) {
      if (
        locationX >= touchArea.x[0] && locationX <= touchArea.x[1] &&
        locationY >= touchArea.y[0] && locationY <= touchArea.y[1]
      ) {
        setSelectedImage(touchArea.image);
        setImageModalVisible(false);
        setCamModalVisible(true);
        return;
      }
    }
  };

  // Specific touch areas for each image
  const specificTouchAreas = {
    MapImage1: [
      { x: [135, 155], y: [165, 185], site: 'JEF012' },
      { x: [180, 200], y: [142, 162], site: 'JEF009' },
      { x: [205, 225], y: [140, 160], site: 'JEF013' },
    ],
    MapImage2: [
      { x: [235, 255], y: [75, 95], site: 'GAL038' },
      { x: [168, 188], y: [133, 153], site: 'GAL037' },
      { x: [95, 115], y: [220, 240], site: 'GAL036' },
    ],
    MapImage3: [
      { x: [230, 250], y: [65, 85], site: 'BRA012' },
      { x: [215, 235], y: [85, 105], site: 'BRA011' },
      { x: [108, 128], y: [255, 275], site: 'BRA010' },
    ],
    MapImage4: [
      { x: [187, 207], y: [110, 130], site: 'NUE014' },
      { x: [165, 185], y: [180, 200], site: 'NUE015' },
      { x: [150, 170], y: [242, 262], site: 'NUE016' },
    ],
    MapImage5: [
      { x: [170, 190], y: [95, 115], site: 'CAM011' },
      { x: [178, 198], y: [150, 170], site: 'CAM030' },
      { x: [185, 205], y: [200, 220], site: 'CAM010' },
    ],
  };

  const zoomBtn = {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    fontWeight: 'bold',
  };
  
  const zoomToCorner = (corner) => {
    const imageWidth = screenWidth * 0.9;
    const imageHeight = screenHeight * 0.75;
  
    let x = 0, y = 0;
  
    if (corner === 'top-left') {
      x = -imageWidth / 2;
      y = -imageHeight / 2;
    } else if (corner === 'top-right') {
      x = imageWidth / 2;
      y = -imageHeight / 2;
    } else if (corner === 'bottom-left') {
      x = -imageWidth / 2;
      y = imageHeight / 2;
    } else if (corner === 'bottom-right') {
      x = imageWidth / 2;
      y = imageHeight / 2;
    }
  
    zoomRef.current?.centerOn({
      x,
      y,
      scale: 2.5, // You can adjust the zoom level here
      duration: 300,
    });
  };
  

  const handleCamPress = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;

    // Determine the current image based on the selectedImage state
    let currentImageKey = null;
    if (selectedImage === MapImage1) {
      currentImageKey = 'MapImage1';
    } else if (selectedImage === MapImage2) {
      currentImageKey = 'MapImage2';
    }
    else if (selectedImage === MapImage3) {
      currentImageKey = 'MapImage3';
    }
    else if (selectedImage === MapImage4) {
      currentImageKey = 'MapImage4';
    }
    else if (selectedImage === MapImage5) {
      currentImageKey = 'MapImage5';
    }

    if (currentImageKey && specificTouchAreas[currentImageKey]) {
      const touchAreas = specificTouchAreas[currentImageKey];

      for (const touchArea of touchAreas) {
        if (
          locationX >= touchArea.x[0] && locationX <= touchArea.x[1] &&
          locationY >= touchArea.y[0] && locationY <= touchArea.y[1]
        ) {
          setSelectedSite(touchArea.site);
          setCamModalVisible(false);
          return;
        }
      }
    }

    // Common touch area (if needed)
    const commonTouchArea = {
      x: [270, 350],
      y: [270, 350],
    };

    if (
      locationX >= commonTouchArea.x[0] && locationX < commonTouchArea.x[1] &&
      locationY >= commonTouchArea.y[0] && locationY < commonTouchArea.y[1]
    ) {
      // Add any common action if required
      setCamModalVisible(false);
      setImageModalVisible(true);
    }
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
      const lastFetchDate = await AsyncStorage.getItem(`lastFetchDate-${storageKey}`);
      const today = new Date().toISOString().split('T')[0];
    
      let data;
      if (lastFetchDate !== today) {
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
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: screenWidth * 0.9,
              height: screenHeight * 0.75,
              position: 'relative',
              marginBottom: 200,
            }}
          >
            <Image
              source={require('../assets/images/map_images/map_5.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
            {/* Region 1 */}
            <TouchableOpacity
              onPress={() => openMap(1)}
              style={{
                position: 'absolute',
                left: 328 * (screenWidth * 0.9 / originalImageWidth),
                top: 890 * (screenHeight * 0.75 / originalImageHeight),
                width: (600 - 328) * (screenWidth * 0.9 / originalImageWidth),
                height: (1110 - 890) * (screenHeight * 0.75 / originalImageHeight),
              }}
            />

            {/* Region 2 */}
            <TouchableOpacity
              onPress={() => openMap(2)}
              style={{
                position: 'absolute',
                left: 276 * (screenWidth * 0.9 / originalImageWidth),
                top: 673 * (screenHeight * 0.75 / originalImageHeight),
                width: (421 - 276) * (screenWidth * 0.9 / originalImageWidth),
                height: (754 - 673) * (screenHeight * 0.75 / originalImageHeight),
              }}
            />

            {/* Region 3 */}
            <TouchableOpacity
              onPress={() => openMap(3)}
              style={{
                position: 'absolute',
                left: 364 * (screenWidth * 0.9 / originalImageWidth),
                top: 484 * (screenHeight * 0.75 / originalImageHeight),
                width: (588 - 364) * (screenWidth * 0.9 / originalImageWidth),
                height: (675 - 484) * (screenHeight * 0.75 / originalImageHeight),
              }}
            />

            {/* Close button */}
            <TouchableOpacity
              onPress={() => setImageModalVisible(false)}
              style={{
                alignSelf: 'center',
                marginTop: 50,
                backgroundColor: 'rgba(0,0,0,0.7)',
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
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