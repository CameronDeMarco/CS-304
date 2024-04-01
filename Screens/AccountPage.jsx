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
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
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
  const [index, setIndex] = useState(0);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [profileImageUri, setProfileImageUri] = useState('assets/images/logo.png');
  const [backgroundImageUri, setBackgroundImageUri] = useState('assets/images/cover.jpg');

  useEffect(() => {
    // Retrieve the token from AsyncStorage
    AsyncStorage.getItem('token')
      .then(token => {
        // Make a request to the server endpoint with the token in the Authorization header
        axios.get('http://10.20.148.198:5001/api/user', {
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
              fetchUserImages(res.data.userId);
              console.log("User id ", res.data.userId);
              console.log("Username ", res.data.username);
            } else {
              // Authentication failed, handle the error message
              setAuth(false);
              setMessage(res.data.Error);
            }
          })
          .catch(err => console.error(err)); // Handle request error
      })
      .catch(error => console.error('Error retrieving token:', error)); // Handle AsyncStorage error
  }, []);

  const fetchUserImages = async (userId) => {
    try {
      // Fetch profile picture
      const profileResponse = await axios.get(`http://10.20.148.198:5001/api/user/${userId}/profile-picture`);
      if (profileResponse.status === 200) {
        setProfilePicture(profileResponse.data);
      } else {
        setProfilePicture(null);
        console.error('Error fetching profile picture. Status:', profileResponse.status);
      }

      // Fetch background picture
      const backgroundResponse = await axios.get(`http://10.20.148.198:5001/api/user/${userId}/background-picture`);
      if (backgroundResponse.status === 200) {
        setBackgroundPicture(backgroundResponse.data);
      } else {
        setBackgroundPicture(null);
        console.error('Error fetching background picture. Status:', backgroundResponse.status);
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  const pickImage = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        if (type === 'profile') {
          setProfilePicture(result.uri);
          uploadProfilePicture(result.uri);
        } else if (type === 'background') {
          setBackgroundPicture(result.uri);
          uploadBackgroundPicture(result.uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadProfilePicture = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpg',
      });

      console.log(formData);

      const response = await axios.post(`http://10.20.148.198:5001/api/user/${userId}/upload-profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile picture uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const uploadBackgroundPicture = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'background.jpg',
        type: 'image/jpg',
      });

      const response = await axios.post(`http://10.20.148.198:5001/api/user/${userId}/upload-background-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
    >
      <StatusBar backgroundColor="#808080" />
      <View>
        <Image
          source={backgroundPicture ? { uri: backgroundPicture } : { uri: backgroundImageUri }}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }}
        />
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
          source={profilePicture ? { uri: profilePicture } : { uri: profileImageUri }}
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