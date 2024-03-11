import { React, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { photos } from "../Components/data";
import images from "../Components/images";

const PhotosRoutes = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={photos}
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
            source={item}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
        </View>
      )}
    />
  </View>
);

const LikesRoutes = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "black",
    }}
  />
);

const renderScene = SceneMap({
  first: PhotosRoutes,
  second: LikesRoutes,
});

const AccountPage = () => {
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "first", title: "Photos" },
    { key: "second", title: "Likes" },
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
      <View style={{ width: "100%" }}>
        <Image
          source={images.cover}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }}
        />
      </View>

      <View style={{ flex: 1, alignItems: "center", }}>
        <Image
          source={images.profile}
          resizeMode="contain"
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: "#FF0000", //red
            borderWidth: 2,
            marginTop: -90,
          }}
        />

        <Text style={{ fontWeight: 'bold', fontSize: 18, lineHeight: 22, color: "#FF0000", marginVertical: 8 }}>User's Name</Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text
            style={{
              fontWeight: 'normal',
              fontSize: 14,
              lineHeight: 20,
              marginLeft: 4,
            }}
          >
            location
          </Text>
        </View>

        <View
          style={{
            paddingVertical: 8,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                lineHeight: 30,
                color: "#000000",
              }}
            >
              122
            </Text>
            <Text
              style={{
                fontWeight: 'normal',
                fontSize: 14,
                lineHeight: 20,
                color: "#000000",
              }}
            >
              Followers
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                lineHeight: 30,
                color: "#000000",
              }}
            >
              67
            </Text>
            <Text
              style={{
                fontWeight: 'normal',
                fontSize: 14,
                lineHeight: 20,
                color: "#000000",
              }}
            >
              Following
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                lineHeight: 30,
                color: "#000000",
              }}
            >
              12k
            </Text>
            <Text
              style={{
                fontWeight: 'normal',
                fontSize: 14,
                lineHeight: 20,
                color: "#000000",
              }}
            >
              Likes
            </Text>
          </View>
        </View>
        <View
          stlye={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000000",
              borderRadius: 99,
              marginHorizontal: 10 * 2,
            }}
          >
            <Text
              style={{
                fontWeight: 'normal',
                fontSize: 14,
                lineHeight: 20,
                color: "#ffffff",
              }}
            >
              Edit Profile
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
