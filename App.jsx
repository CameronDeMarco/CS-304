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

const Logo = () => {
  const theme = useTheme();
  const logoSource = 'https://i.ibb.co/gjfLCDQ/Roamr-Logo.png';
  console.log('Logo Source:', logoSource);
  return (
    <Image
      source={{uri: logoSource}}
      style={{ 
        width: 75, 
        height: 75,

      }}
      resizeMode="contain"
    />
  );
};

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

const MainScreen = () => {
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

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          initialParams={{ isLoggedIn: false }}
          options={{
            headerTitle: '',
            headerShown: false,
            headerStyle: {
              borderBottomWidth: 0,
              backgroundColor: 'transparent',
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