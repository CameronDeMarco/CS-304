import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RawButton, ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownSearch from '../Components/DropdownSearch';
import axios from 'axios';

const UploadPage = () => {
    const theme = useTheme();
    const [ITEMLIST, setItem] = useState([]);
    const [title, setTitle] = useState([]);
    const [content, setContent] = useState([]);

    function addFile(fileName, uri, type) {
        setItem([...ITEMLIST, { fileName: fileName, uri: uri, type: type }]);
        console.log(type);
    }

    const deleteMediaItem = (item) => {
        console.log("delete " + item.fileName);
        setItem(ITEMLIST.filter((search) => search.fileName !== item.fileName));
    }

    async function openCamera() {
        let result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) {
            console.log(result.assets[0].fileName + " selected.");
            addFile(test = result.assets[0].fileName, result.assets[0].uri, result.assets[0].mimeType);
            console.log(result.assets[0]);
        } else {
            console.log("Media selection cancled.");
        }
    }

    const uploadPost = async () => {
        let token;
        try {
            token = await AsyncStorage.getItem('token');
            console.log("token: " + token);
        } catch (error) {
            console.log(error);
        }

        try {
            const uploadForm = new FormData();
            uploadForm.append("title", title);
            uploadForm.append("content", content);
            ITEMLIST.map((item) => uploadForm.append("image", {
                uri: item.uri,
                name: item.fileName,
                type: item.type,
            }));
            const uploadResponse = await axios.postForm('http://10.0.0.10:5001/api/post/upload', uploadForm, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important! This sets the content type to multipart/form-data
                    'authorization': token,
                },
            });
        } catch (error) {
            console.log(error);
            if (error.response) {
                // Server responded with an error status code
                Alert.alert('Error', error.response.data.message || 'Failed to upload. Please try again later.');
                console.log(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                Alert.alert('Error', 'Network Error. Please check your internet connection.');
                console.log(error.request);
            } else {
                // Something else happened
                Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
                console.log('Error', error.message);
            }
        }
    }

    async function selectMedia() {
        let result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            console.log(result.assets[0].fileName + " selected.");
            addFile(test = result.assets[0].fileName, result.assets[0].uri, result.assets[0].mimeType);
            console.log(result.assets[0]);
        } else {
            console.log("Media selection cancled.");
        }
    }

    return (
        <ScrollView style={{ padding: 15 }}>
            <View styles={styles.field}>
                <Text style={[styles.textField, {marginTop: 0, marginBottom: 15}]}>
                    Title
                </Text>
                <TextInput maxLength={50}
                    style={[styles.textInput, styles.androidShadow]}
                    onChangeText={(title) => setTitle(title)}
                />
            </View>
            <View styles={styles.field}>
                <Text style={styles.textField}>
                    Description
                </Text>
                <TextInput
                    style={[styles.multiTextInput, styles.androidShadow]}
                    onChangeText={(content) => setContent(content)}
                    maxLength={150}
                    multiline
                />
            </View>
            <Text style={[styles.textField, {marginBottom: 0}]}>
                Activity
            </Text>
            <DropDownSearch />
            <Text style={{ fontWeight: "bold", fontSize: 22, textDecorationLine: "none", textAlign: 'center', marginTop: 20, marginBottom: 15 }}>
                Select Media From:
            </Text>
            <View style={{ flexDirection: "row", justifyContent: 'space-evenly', }}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.button, }]}
                    onPressOut={() => {
                        openCamera();
                    }}>
                    <Text style={[styles.buttonText, { color: "#ffffff", }]}>
                        Camera
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.button, }]}
                    onPressOut={() => {
                        selectMedia();
                    }}>
                    <Text style={[styles.buttonText, { color: "#ffffff", }]}>
                        Gallery
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                scrollEnabled={false}
                data={ITEMLIST}
                renderItem={({ item }) => <ResourceCard fileName={item.fileName} uri={item.uri} onDelete={() => { deleteMediaItem(item) }} />}
            />
            <View style={{ flex: 1, paddingTop: 15, justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity
                style={[styles.button, { borderRadius: 999, width: '100%', height: 60, aspectRatio: 2, backgroundColor: theme.colors.primary, marginTop: 70}]}
                onPress={uploadPost}
                >
                    <Text style={[styles.buttonText, { fontSize: 18, fontWeight: 'bold', color: "#ffffff", }]}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    field: {
        marginBottom: 180
    },
    textField: {
        fontWeight: "bold", 
        fontSize: 17, 
        textDecorationLine: 'none', 
        textAlign: 'center',
        marginTop: 10, 
        marginBottom: 15
    },

    textInput: {
        backgroundColor: 'white',
        padding: 5,
        borderWidth: 1,
        fontSize: 15,
        borderRadius: 5
    },

    multiTextInput: {
        backgroundColor: 'white',
        padding: 5,
        height: 75,
        borderWidth: 1,
        fontSize: 15,
        textAlignVertical: "top",
        borderRadius: 5
    },
    androidShadow: {
        elevation: 5,
        zIndex: 99,
        shadowColor: 'black',
    },
    button: {
        width: 100,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 99,
    },
    buttonText: {
        fontWeight: 'normal', 
        fontSize: 14, 
        lineHeight: 20, 
    }
});

export default UploadPage;

const ResourceCard = ({ fileName, uri, onDelete }) => {
    let resourceName;
    if (fileName.length > 16) {
        resourceName = fileName.substring(0, 16) + "...";
    } else {
        resourceName = fileName;
    }
    return (
        <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 1, marginHorizontal: 30, marginVertical: 8, backgroundColor: "#E6E6E6" }}>
            <Image source={{ uri: uri }} width={75} height={75} />
            <Text style={{ padding: 15, textAlignVertical: "center", flex: 1 }}>{resourceName}</Text>

            <MaterialCommunityIcons.Button onPress={onDelete} name="image-remove" size={24} color="black" backgroundColor={"#00000000"} style={{ height: "100%" }} />
        </View>
    )
}