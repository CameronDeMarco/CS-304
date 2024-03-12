import AccountPage from './Screens/AccountPage';
import FeedPage from './Screens/FeedPage';
import UploadPage from './Screens/UploadPage';
import Login from './Screens/Login';
import Register from './Screens/Register';
import React from 'react';
import { StyleSheet, View, Switch, Button } from 'react-native';
import { NavigationContainer, useTheme, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from './Components/Color';
import { useDarkMode  } from './Components/Themes';

const LoginButton = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Button
        title="Login"
        color='#4C6E95'
        onPress={() => navigation.navigate('Login')}
      />
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
        theme={theme}
        component={FeedPage}
        options={{
          tabBarLabel: 'Feed',
        }}
      />
      <Tab.Screen
        name="Upload"
        theme={theme}
        component={UploadPage}
        options={{
          tabBarLabel: 'Upload',
        }}
      />
      <Tab.Screen
        name="Account"
        theme={theme}
        component={AccountPage}
        options={{
          tabBarLabel: 'Account',
        }}
      />
      {/* <Tab.Screen
        name="Login"
        theme={theme}
        component={Login}
        options={{
          tabBarLabel: 'Login',
        }}
      /> */}
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
              <Stack.Group>
                <Stack.Screen
                  name="main"
                  component={ TabNavigator }
                  options={() => ({
                    headerRight: () => <LoginButton />,
                    headerTitle: 'Activity App',
                    headerStyle: {
                      backgroundColor: primaryColor,
                    },
                    headerTintColor: 'white',
                  })}
                />
                <Stack.Screen
                  name="Login"
                  component={ Login }
                  options={() => ({
                    headerTitle: 'Activity App',
                    headerStyle: {
                      backgroundColor: primaryColor,
                    },
                    headerTintColor: 'white',
                  })}
                />
                 <Stack.Screen
                  name="Register"
                  component={ Register }
                  options={() => ({
                    headerTitle: 'Activity App',
                    headerStyle: {
                      backgroundColor: primaryColor,
                    },
                    headerTintColor: 'white',
                  })}
                />
              </Stack.Group>
            </Stack.Navigator>
          </View>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
