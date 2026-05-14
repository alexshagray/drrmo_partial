import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, PermissionsAndroid, Platform, TextInput, Keyboard, Linking } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { createLocation } from '../api/locations';
import { useUser } from '../context/UserContext';
import { searchResidents, Resident } from '../api/residents';

interface CurrentLocation {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

const LocationScreen: React.FC = () => {
  const { user } = useUser();
  const [locationName, setLocationName] = useState('');
  const [searchResults, setSearchResults] = useState<Resident[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [areaSearch, setAreaSearch] = useState('');
  const [areaResults, setAreaResults] = useState<string[]>([]);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');

  const commonAreas = [
    'Awang',
    'Bagocboc',
    'Barra',
    'Bonbon',
    'Cauyonan',
    'Igpit',
    'Limonda',
    'Luyong Bonbon',
    'Malanang',
    'Nangcaon',
    'Patag',
    'Poblacion',
    'Taboc',
    'Tingalan',
  ];

  const areaCoordinates: { [key: string]: { latitude: number; longitude: number } } = {
    'Awang': { latitude: 8.5157, longitude: 124.5892 },
    'Bagocboc': { latitude: 8.5289, longitude: 124.6023 },
    'Barra': { latitude: 8.5345, longitude: 124.6187 },
    'Bonbon': { latitude: 8.5412, longitude: 124.6256 },
    'Cauyonan': { latitude: 8.5523, longitude: 124.6389 },
    'Igpit': { latitude: 8.5634, longitude: 124.6456 },
    'Limonda': { latitude: 8.5745, longitude: 124.6523 },
    'Luyong Bonbon': { latitude: 8.5856, longitude: 124.6590 },
    'Malanang': { latitude: 8.5967, longitude: 124.6657 },
    'Nangcaon': { latitude: 8.6078, longitude: 124.6724 },
    'Patag': { latitude: 8.6189, longitude: 124.6791 },
    'Poblacion': { latitude: 8.5034, longitude: 124.5767 },
    'Taboc': { latitude: 8.5278, longitude: 124.5956 },
    'Tingalan': { latitude: 8.5401, longitude: 124.6089 },
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = debounce(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const results = await searchResidents(query);
      setSearchResults(results.data || []);
      setShowDropdown(results.data && results.data.length > 0);
    } catch (error) {
      console.error('Search error:', error);
    }
  }, 500);

  const handleAreaSearch = debounce((query: string) => {
    if (query.length < 2) {
      setAreaResults([]);
      setShowAreaDropdown(false);
      return;
    }

    const filteredAreas = commonAreas.filter(area => 
      area.toLowerCase().includes(query.toLowerCase())
    );
    setAreaResults(filteredAreas);
    setShowAreaDropdown(filteredAreas.length > 0);
  }, 300);

  const selectResident = (resident: Resident) => {
    const fullName = `${resident.last_name}, ${resident.first_name} ${resident.middle_name || ''}`;
    setLocationName(fullName);
    setSelectedAddress(`${resident.address}, ${resident.barangay}`);
    setShowDropdown(false);
    Keyboard.dismiss();

    // Automatically show map for resident's barangay
    if (areaCoordinates[resident.barangay]) {
      const coords = areaCoordinates[resident.barangay];
      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: fullName,
        address: `${resident.address}, ${resident.barangay}${resident.zone_sitio ? ` - ${resident.zone_sitio}` : ''}`,
      });
    }
  };

  const selectArea = (area: string) => {
    setSelectedArea(area);
    setAreaSearch(area);
    setShowAreaDropdown(false);
    Keyboard.dismiss();

    // Automatically show map for selected area
    if (areaCoordinates[area]) {
      const coords = areaCoordinates[area];
      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: area,
        address: `${area}, Opol, Misamis Oriental`,
      });
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to track your current position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    }
  };

  const getCurrentLocation = async () => {
    if (!locationName.trim() && !selectedArea.trim()) {
      Alert.alert('Name Required', 'Please enter a location name or select an area before tracking.');
      return;
    }

    // If map is already shown, just save the location
    if (currentLocation) {
      setLoading(true);
      try {
        await createLocation({ 
          latitude: currentLocation.latitude, 
          longitude: currentLocation.longitude, 
          address: currentLocation.address 
        });
        
        Alert.alert('Success', 'Location saved successfully!');
        setLocationName('');
        setSelectedAddress('');
        setAreaSearch('');
        setSelectedArea('');
        setCurrentLocation(null);
      } catch (error: any) {
        console.error('Location save error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save location. Please try again.';
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Show location based on selected area first
    if (selectedArea && areaCoordinates[selectedArea]) {
      const coords = areaCoordinates[selectedArea];
      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: selectedArea,
        address: `${selectedArea}, Opol, Misamis Oriental`,
      });
      return;
    }

    // Show location based on selected resident's barangay
    if (selectedAddress && searchResults.length > 0) {
      const selectedResident = searchResults.find(r => 
        `${r.last_name}, ${r.first_name} ${r.middle_name || ''}` === locationName
      );
      
      if (selectedResident && areaCoordinates[selectedResident.barangay]) {
        const coords = areaCoordinates[selectedResident.barangay];
        setCurrentLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          name: locationName,
          address: `${selectedAddress}${selectedResident.zone_sitio ? ` - ${selectedResident.zone_sitio}` : ''}`,
        });
        return;
      }
    }

    // Fall back to GPS tracking
    setLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required to get your current location.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const addressToUse = selectedAddress || selectedArea || locationName;
      setCurrentLocation({ latitude, longitude, name: locationName || selectedArea, address: addressToUse });
      
      console.log('Saving location:', { latitude, longitude, address: addressToUse });
      
      await createLocation({ latitude, longitude, address: addressToUse });
      
      Alert.alert('Success', 'Location saved successfully!');
      setLocationName('');
      setSelectedAddress('');
      setAreaSearch('');
      setSelectedArea('');
    } catch (error: any) {
      console.error('Location save error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get location. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Location Tracking</Text>
        <Text style={styles.headerSubtitle}>Track and save your current location</Text>
      </View>

      {currentLocation && (
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>📍 Location Map</Text>
            <TouchableOpacity onPress={() => setCurrentLocation(null)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapWrapper}>
            <WebView
              style={styles.map}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
                    <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet">
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      html, body { width: 100%; height: 100%; overflow: hidden; }
                      #map { width: 100%; height: 100%; }
                    </style>
                  </head>
                  <body>
                    <div id="map"></div>
                    <script>
                      try {
                        mapboxgl.accessToken = 'pk.eyJ1IjoiaGFlbGVlaGVhdGhlciIsImEiOiJjbXA1NWRmY2QweXV5MnFvNGg2MnZwcDV2In0.t3xM4WjlV9qY8poFrTkqZA';
                        const map = new mapboxgl.Map({
                          container: 'map',
                          style: 'mapbox://styles/mapbox/streets-v12',
                          center: [${currentLocation.longitude}, ${currentLocation.latitude}],
                          zoom: 14
                        });
                        map.addControl(new mapboxgl.NavigationControl());
                        new mapboxgl.Marker({ color: '#2563eb' })
                          .setLngLat([${currentLocation.longitude}, ${currentLocation.latitude}])
                          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<div style="font-size:14px;font-weight:bold;">${currentLocation.name}</div><div style="font-size:12px;">${currentLocation.address}</div>'))
                          .addTo(map);
                      } catch (error) {
                        console.error('Mapbox error:', error);
                        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:20px;"><h3>Map Error</h3><p>Unable to load map. Please check your connection.</p></div>';
                      }
                    </script>
                  </body>
                  </html>
                `
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView HTTP error: ', nativeEvent);
              }}
            />
          </View>
          <View style={styles.mapInfo}>
            <Text style={styles.mapInfoText}>{currentLocation.name}</Text>
            {currentLocation.address && (
              <Text style={styles.mapInfoAddress}>{currentLocation.address}</Text>
            )}
            <View style={styles.coordinateContainer}>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Latitude:</Text>
                <Text style={styles.coordinateValue}>{currentLocation.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Longitude:</Text>
                <Text style={styles.coordinateValue}>{currentLocation.longitude.toFixed(6)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.openMapButton}
              onPress={() => Linking.openURL(`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`)}
            >
              <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Track Location</Text>
          <Text style={styles.label}>Resident Name</Text>
          <Text style={styles.hint}>Start typing to search residents from database...</Text>
          <TextInput
            style={styles.input}
            value={locationName}
            onChangeText={(text) => {
              setLocationName(text);
              handleSearch(text);
            }}
            placeholder="Enter resident name to search..."
            placeholderTextColor="#9ca3af"
          />

          {showDropdown && searchResults.length > 0 && (
            <View style={styles.dropdownContainer}>
              <ScrollView
                style={styles.dropdownList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => selectResident(item)}
                  >
                    <Text style={styles.dropdownItemName}>
                      {item.last_name}, {item.first_name} {item.middle_name || ''}
                    </Text>
                    <Text style={styles.dropdownItemAddress}>
                      {item.address}, {item.barangay}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.label}>Search Incident Area</Text>
          <Text style={styles.hint}>Search for zones, barangays, or areas...</Text>
          <TextInput
            style={styles.input}
            value={areaSearch}
            onChangeText={(text) => {
              setAreaSearch(text);
              handleAreaSearch(text);
            }}
            placeholder="Search area (e.g., Zone 1, Barangay 1)..."
            placeholderTextColor="#9ca3af"
          />

          {showAreaDropdown && areaResults.length > 0 && (
            <View style={styles.dropdownContainer}>
              <ScrollView
                style={styles.dropdownList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {areaResults.map((area, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => selectArea(area)}
                  >
                    <Text style={styles.dropdownItemName}>{area}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {selectedArea && (
            <View style={styles.selectedAreaContainer}>
              <Text style={styles.selectedAreaLabel}>Selected Area:</Text>
              <Text style={styles.selectedAreaText}>{selectedArea}</Text>
              <TouchableOpacity onPress={() => { setSelectedArea(''); setAreaSearch(''); }}>
                <Text style={styles.clearAreaText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.trackButton, loading && styles.trackButtonDisabled]}
            onPress={getCurrentLocation}
            disabled={loading}
          >
            <Text style={styles.trackButtonText}>
              {loading ? 'Tracking...' : 'Track the Location'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e40af',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 14,
    marginTop: 4,
  },
  mapContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e40af',
  },
  mapTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mapWrapper: {
    height: 300,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  coordinateContainer: {
    width: '100%',
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  coordinateLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  coordinateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  openMapButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  openMapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapInfo: {
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  mapInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  mapInfoAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    maxHeight: 200,
    backgroundColor: '#fff',
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  dropdownItemAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedAreaContainer: {
    marginTop: 12,
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  selectedAreaLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  selectedAreaText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: 'bold',
    marginTop: 4,
  },
  clearAreaText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
    fontWeight: '600',
  },
  trackButton: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  trackButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationScreen;
