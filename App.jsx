import AccountPage from './Screens/AccountPage';
import FeedPage from './Screens/FeedPage';
import UploadPage from './Screens/UploadPage';
import Login from './Screens/Login';
import Register from './Screens/Register';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer, useTheme, useNavigation, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from './Components/Color';
import { useDarkMode  } from './Components/Themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
//const Logo = require('./assets/images/logo');

const Logo = () => {
  const theme = useTheme();
  const logoSource = require('./assets/adaptive-icon.png');
  console.log('Logo Source:', logoSource);
  return (
    <Image
      source={logoSource}
      style={{ 
        width: 25, 
        height: 25,
        borderRadius: 999,
        borderColor: theme.colors.primary, //red
        borderWidth: 2,
      }}
      resizeMode="contain"
    />
  );
};

const LogoutButton = ({ isLoggedIn, onLogout }) => {
  const theme = useTheme();
  return (
    <View>
      {!isLoggedIn ? (
        null
      ) : (
        <TouchableOpacity
          title="Logout"
          color='#4C6E95'
          onPress={onLogout}
          style={{
            width: 100,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.button,
            borderRadius: 99,
            marginHorizontal: 10 * 2,
          }}
        >
          <Text style={{
              fontWeight: 'normal',
              fontSize: 14,
              lineHeight: 20,
              color: "#ffffff",
            }}>
              Logout
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Feed') {
            iconName = 'activity';
          } else if (route.name === 'Upload') {
            iconName = 'upload';
          } else if (route.name === 'Account') {
            iconName = 'smile';
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [{ display: 'flex' }, null],
      })}
    >
      <Tab.Screen
        name="Feed"
        component={FeedPage}
        options={{
          tabBarLabel: 'Feed',
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadPage}
        options={{
          tabBarLabel: 'Upload',
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountPage}
        options={{
          tabBarLabel: 'Account',
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();
export default function App() {
  const { isDarkMode, toggleDarkMode, switchThumbColor, switchTrackColor, theme } = useDarkMode();

  return (
    <NavigationContainer theme={theme}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={() => ({
              headerLeft: () => <Logo />,
              headerTitle: 'Roamr',
              headerStyle: {
                backgroundColor: primaryColor,
              },
              headerTintColor: 'white',
            })}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={() => ({
              headerTitle: 'Login',
              headerStyle: {
                backgroundColor: primaryColor,
              },
              headerTintColor: 'white',
            })}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={() => ({
              headerTitle: 'Register',
              headerStyle: {
                backgroundColor: primaryColor,
              },
              headerTintColor: 'white',
            })}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const MainScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token); // Update login status based on token existence
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setIsLoggedIn(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
      Alert.alert(`Successfully logged out`);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          initialParams={{ isLoggedIn: true }} // Pass the login status as a parameter
          options={{
            headerRight: () => <LogoutButton isLoggedIn={isLoggedIn} onLogout={handleLogout} />,
            headerLeft: null, // Hide the header left component
            headerTitle: '',
            headerShown: true,
            headerStyle: {
              borderBottomWidth: 0, // Remove the border
              backgroundColor: 'transparent', // Set background color if needed
            }
          }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};