import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, PermissionsAndroid, Platform, TextInput, Keyboard, Linking } from 'react-native';
import * as Location from 'expo-location';
import { createLocation } from '../api/locations';
import { Location as LocationType } from '../types';
import { useUser } from '../context/UserContext';
import { searchResidents, Resident } from '../api/residents';

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

const DashboardScreen: React.FC = () => {
  const { user } = useUser();
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; name: string; address?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [searchResults, setSearchResults] = useState<Resident[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const stats = [
    { title: 'Active Incidents', value: '12', color: '#ef4444' },
    { title: 'Available Items', value: '84', color: '#22c55e' },
    { title: 'Personnel', value: '24', color: '#3b82f6' },
    { title: 'Hazard Zones', value: '7', color: '#f59e0b' },
  ];

  const handleLocationNameChange = (text: string) => {
    setLocationName(text);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // If text is empty, hide dropdown
    if (!text || text.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(async () => {
      try {
        const response = await searchResidents(text);
        setSearchResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching residents:', error);
        setSearchResults([]);
      }
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const selectResident = (resident: Resident) => {
    const fullName = `${resident.last_name}, ${resident.first_name} ${resident.middle_name || ''}`.trim();
    const fullAddress = `${resident.address}, ${resident.barangay}`.trim();
    setLocationName(fullName);
    setSelectedAddress(fullAddress);
    setShowDropdown(false);
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to track your position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
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
    if (!locationName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for this location before tracking.');
      return;
    }

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
      
      const addressToUse = selectedAddress || locationName;
      setCurrentLocation({ latitude, longitude, name: locationName, address: addressToUse });
      
      console.log('Saving location:', { latitude, longitude, address: addressToUse });
      
      await createLocation({ latitude, longitude, address: addressToUse });
      
      // Automatically open Google Maps
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      await Linking.openURL(mapUrl);
      
      Alert.alert('Success', 'Location saved successfully! Map opened.');
      setLocationName('');
      setSelectedAddress('');
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
        <Text style={styles.headerTitle}>Balansag Command</Text>
        <Text style={styles.headerSubtitle}>Emergency Response Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>New Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Dispatch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Tracking</Text>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.locationNameInput}
            placeholder="Enter location name or search resident..."
            placeholderTextColor="#9ca3af"
            value={locationName}
            onChangeText={handleLocationNameChange}
          />
        </View>

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

        <TouchableOpacity 
          style={[styles.locationBtn, loading && styles.locationBtnDisabled]} 
          onPress={getCurrentLocation}
          disabled={loading}
        >
          <Text style={styles.locationBtnText}>
            {loading ? 'Getting Location...' : '📍 Track the Location'}
          </Text>
        </TouchableOpacity>

        {currentLocation && (
          <View style={styles.locationCard}>
            <Text style={styles.locationCardTitle}>📍 {currentLocation.name}</Text>
            {currentLocation.address && (
              <Text style={styles.locationAddress}>{currentLocation.address}</Text>
            )}
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}>Latitude:</Text>
              <Text style={styles.coordinateValue}>{currentLocation.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}>Longitude:</Text>
              <Text style={styles.coordinateValue}>{currentLocation.longitude.toFixed(6)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.openMapBtn}
              onPress={() => {
                const url = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
                if (Platform.OS === 'web') {
                  window.open(url, '_blank');
                } else {
                  Alert.alert('Open in Maps', `Coordinates: ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`);
                }
              }}
            >
              <Text style={styles.openMapBtnText}>View in Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1e3a5f',
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#93c5fd',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationNameInput: {
    padding: 16,
    fontSize: 14,
    color: '#111827',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownList: {
    borderRadius: 12,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dropdownItemAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  locationBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  locationBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  locationBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coordinateLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  coordinateValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  openMapBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  openMapBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default DashboardScreen;