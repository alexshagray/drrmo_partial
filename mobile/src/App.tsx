import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DashboardScreen from './screens/DashboardScreen';
import DispatchScreen from './screens/DispatchScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import LocationScreen from './screens/LocationScreen';
import { UserProvider, useUser } from './context/UserContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { logout } = useUser();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#2563eb',
        }}
      >
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            headerRight: () => (
              <View style={{ marginRight: 15 }}>
                {/* Add logout button here if needed */}
              </View>
            ),
          }}
        />
        <Tab.Screen name="Location" component={LocationScreen} />
        <Tab.Screen name="Request Form" component={DispatchScreen} />
        <Tab.Screen
          name="Profile"
          component={SettingsScreen}
          options={{
            headerRight: () => (
              <View style={{ marginRight: 15 }}>
                {/* Add logout button here if needed */}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </View>
  );
}

function AuthStack() {
  const { setUser } = useUser();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#667eea' },
      }}
    >
      <Stack.Screen
        name="Login"
      >
        {(props) => (
          <LoginScreen
            {...props}
            onLogin={(userData: any) => {
              const mockUser = {
                id: '1',
                name: userData.username,
                email: 'mobile@user.com',
                role: 'mobile',
                username: userData.username,
              };
              setUser(mockUser);
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  return <MainTabs />;
}

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </SafeAreaProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
