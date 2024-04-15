import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { NavigationContainer, useTheme, useNavigation, CommonActions } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
//import CustomHeader from "../Components/CustomHeader";

const PhotosRoutes = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={null}
      numColumns={3}
      renderItem={({ item, index }) => (
        <View
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 3,
          }}
        >
          <Image
            key={index}
            source={null}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
        </View>
      )}
    />
  </View>
);

const renderScene = SceneMap({
  first: PhotosRoutes
});

const AccountPage = () => {
  const theme = useTheme();
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [profileImageUri, setProfileImageUri] = useState('assets/images/logo.png');
  const [backgroundImageUri, setBackgroundImageUri] = useState('assets/images/cover.jpg');
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [backgroundPictureUrl, setBackgroundPictureUrl] = useState(null);

  useEffect(() => {
    // Retrieve the token from AsyncStorage
    AsyncStorage.getItem('token')
      .then(token => {
        // Make a request to the server endpoint with the token in the Authorization header
        axios.get('http://10.20.148.206:5001/api/user', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the Authorization header
          }
        })
          .then(res => {
            if (res.data.Status === "Success") {
              // Authentication successful, set auth state and user details
              setAuth(true);
              setUserId(res.data.userId);
              setUsername(res.data.username);
              fetchUserImages(token);
              console.log("User id ", res.data.userId);
              console.log("Username ", res.data.username);
            } else {
              // Authentication failed, handle the error message
              setAuth(false);
              console.log("token: " + token);
              setMessage(res.data.Error);
            }
          })
          .catch(err => console.error(err)); // Handle request error
      })
      .catch(error => console.error('Error retrieving token:', error)); // Handle AsyncStorage error
  }, []);

  const handleLogout = () => {
    try {
      console.log("executing...")
      AsyncStorage.removeItem("token");
      setAuth(false);
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

  const addProfilePicture = (fileName, uri, type) => {
    setProfilePicture({ fileName:fileName, uri:uri, type:type });
    console.log(type);
  };

  const addBackgroundPicture = (fileName, uri, type) => {
    setBackgroundPicture({ fileName:fileName, uri:uri, type:type });
    console.log(type);
  };

  const fetchUserImages = async (token) => {
    try {
      // Fetch profile picture
      const profileResponse = await axios.get(`http://10.20.148.206:5001/api/user/profile-picture`, {
        headers: {
          'authorization': token,
        },
      });
      if (profileResponse.status === 200) {
        setProfilePictureUrl(profileResponse.data.imageUrl);
        console.log(profilePictureUrl);
      } else {
        setProfilePictureUrl(null);
        console.error('Error fetching profile picture. Status:', profileResponse.status);
      }

      // Fetch background picture
      const backgroundResponse = await axios.get(`http://10.20.148.206:5001/api/user/background-picture`, {
        headers: {
          'authorization': token,
        },
      });
      if (backgroundResponse.status === 200) {
        setBackgroundPictureUrl(backgroundResponse.data.imageUrl);
        console.log(backgroundPictureUrl);
      } else {
        setBackgroundPictureUrl(null);
        console.error('Error fetching background picture. Status:', backgroundResponse.status);
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  async function pickImage (type) {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        if (type === 'profile') {
          const fileName = result.assets[0].fileName || 'Cropped-Image.jpg';
          console.log(fileName + " selected.");
          addProfilePicture(fileName, result.assets[0].uri, result.assets[0].mimeType);
          uploadProfilePicture();
          console.log(result.assets[0]);
        } else if (type === 'background') {
          const fileName = result.assets[0].fileName || 'Cropped-Image.jpg';
          console.log(fileName + " selected.");
          addBackgroundPicture(fileName, result.assets[0].uri, result.assets[0].mimeType);
          uploadBackgroundPicture();
          console.log(result.assets[0]);
        } 
      } else {
        console.log("Image selection canceled.");
    }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadProfilePicture = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      console.log("token: " + token);
    } catch (error) {
      console.log(error);
    }
    try {
      const formData = new FormData();
      if (profilePicture) {
        formData.append('image', {
          uri: profilePicture.uri,
          name: profilePicture.fileName,
          type: profilePicture.type,
        });
      }

      console.log(formData);

      const response = await axios.post(`http://10.20.148.206:5001/api/user/upload-profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': token,
        },
      });

      console.log('Profile picture uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const uploadBackgroundPicture = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      console.log("token: " + token);
    } catch (error) {
      console.log(error);
    }
    try {
      const formData = new FormData();
      if (backgroundPicture) {
        formData.append('image', {
          uri: backgroundPicture.uri,
          name: backgroundPicture.fileName,
          type: backgroundPicture.type,
        });
      }

      const response = await axios.post(`http://10.20.148.206:5001/api/user/upload-background-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': token,
        },
      });

      console.log('Background picture uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading background picture:', error);
    }
  };

  const [routes] = useState([
    { key: "first", title: "Photos" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "#000000",
      }}
      style={{
        backgroundColor: "#ffffff",
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text style={[{ color: focused ? "#000000" : "#808080" }]}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
      edges={['bottom']}
    >
      <StatusBar backgroundColor="#808080" />
      <View style={{ position: 'relative', flex: 1 }}>
        <Image
          source={backgroundPictureUrl ? { uri: `http://10.20.148.206:5001/uploads/${backgroundPictureUrl}` } : { uri: backgroundImageUri }}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }}
        />
        {!auth ? (
          null
        ) : (
          <TouchableOpacity
            title="Logout"
            onPress={handleLogout}
            style={{
              position: 'absolute',
              top: 10,
              right: 0,
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

      <View style={{ flex: 1, alignItems: "center", }}>
        <Image
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: theme.colors.primary, //red
            borderWidth: 2,
            marginTop: -90,
          }}
          source={profilePictureUrl ? { uri: `http://10.20.148.206:5001/uploads/${profilePictureUrl}` } : { uri: profileImageUri }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            lineHeight: 22,
            color: theme.colors.text,
            marginVertical: 8
          }}>
          {username}
        </Text>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity style={{
            width: 160,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.button,
            borderRadius: 99,
            marginVertical: 10,
          }}
            onPress={() => pickImage('profile')}>
            <Text style={{
              fontWeight: 'normal',
              fontSize: 14,
              lineHeight: 20,
              color: "#ffffff",
            }}>
              Upload Profile Picture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            width: 200,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.button,
            borderRadius: 99,
            marginHorizontal: 10 * 2,
          }}
            onPress={() => pickImage('background')}>
            <Text style={{
              fontWeight: 'normal',
              fontSize: 14,
              lineHeight: 20,
              color: "#ffffff",
            }}>
              Upload Background Picture
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginHorizontal: 22,
          marginTop: 50,
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};

export default AccountPage;