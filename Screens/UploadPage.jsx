import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable , FlatList, Image, Alert} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RawButton, ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownSearch  from '../Components/DropdownSearch';
import axios from 'axios';


const UploadPage = () => {
    const theme = useTheme();
    const [ITEMLIST, setItem] = useState([]);
    const[title, setTitle] = useState([]);
    const[content, setContent] = useState([]);

    function addFile(fileName, uri){
        setItem([...ITEMLIST, {fileName:fileName, uri:uri}]);
    }

    const deleteMediaItem = (item) => {
        console.log("delete " + item.fileName);
        setItem(ITEMLIST.filter((search) => search.fileName !==  item.fileName));
    }

    async function openCamera(){
        let result = await ImagePicker.launchCameraAsync();
        if(!result.canceled){
            console.log(result.assets[0].fileName + " selected.");
            addFile(test=result.assets[0].fileName, result.assets[0].uri);
            console.log(result.assets[0]);
        }else{
            console.log("Media selection cancled.");
        }
    }

    const uploadPost = async () => {
        let token;
        try{
            token = await AsyncStorage.getItem('token');
            console.log("token: " + token);
        }catch(error){
            console.log(error);
        }

        try{
            const uploadResponse = await axios.post('http://10.20.147.194:5001/api/post/upload', {
                //body
                title,
                content,
                token: token
            });
        }catch(error){
            console.log(error);
            console.log(error.response.data);
            if(error.responce){
                
            }else if(error.request){
                Alert.alert('Error', 'Network Error. Please check your internet connection.');
            }else{
                console.log('Error', error.message);
            }
        }
    }

    async function selectMedia(){
        let result = await ImagePicker.launchImageLibraryAsync();

        if(!result.canceled){
            console.log(result.assets[0].fileName + " selected.");
            addFile(test=result.assets[0].fileName, result.assets[0].uri);
            console.log(result.assets[0]);
        }else{
            console.log("Media selection cancled.");
        }
    }

    return (
        <ScrollView style={{padding:15}}>
            <View styles={styles.field}>
                <Text style={styles.textField}>Title</Text>
                <TextInput maxLength={50} 
                    style={[styles.textInput, styles.androidShadow]} 
                    onChangeText={(title) => setTitle(title)}
                />
            </View>
            <View styles={styles.field}>
                <Text style={styles.textField}>Description</Text>
                <TextInput
                    style={[styles.multiTextInput, styles.androidShadow]} 
                    onChangeText={(content) => setContent(content)}
                    maxLength={150} 
                    multiline
                />
            </View>
            <DropDownSearch />
            <Text style={{fontWeight:"bold", fontSize:22, textDecorationLine:"underline", textAlign:'center', marginTop:20, marginBottom:5}}>Media</Text>
            <View style={{flexDirection:"row", justifyContent:"center"}}>
                <Pressable
                style={{marginHorizontal:15}}
                onPressOut={()=>{
                    openCamera();
                }}>
                    <Text style={{color:"#3CCDB7", width:"100%", fontSize:19, marginBottom:25, textAlignVertical:'center'}}>+ Camera</Text>
                </Pressable>
                <Pressable 
                style={{marginHorizontal:15}}
                onPressOut={()=>{
                    selectMedia();
                }}>
                <Text style={{color:"#3CCDB7", width:"100%", fontSize:19, marginBottom:25, textAlignVertical:'center'}}>+ Gallery</Text>
                </Pressable>
            </View>
            <FlatList 
                scrollEnabled={false}
                data={ITEMLIST}
                renderItem={({item}) => <ResourceCard fileName={item.fileName} uri={item.uri} onDelete={() => {deleteMediaItem(item)}}/>}
            />
            <View style={{paddingTop:15, width: 100, height: 100}}>
                <Button title="Upload" onPress={uploadPost} />
            </View>
        </ScrollView>
    
    )
}

const styles = StyleSheet.create({
    field:{
        marginBottom: 180
    },
    textField:{
        fontSize:17
    },

    textInput:{
        backgroundColor: 'white',
        padding:5, 
        borderWidth:1, 
        fontSize:15,
        borderRadius:5
    },

    multiTextInput:{
        backgroundColor: 'white',
        padding: 5, 
        height: 75, 
        borderWidth:1, 
        fontSize:15, 
        textAlignVertical:"top",
        borderRadius:5
    },
    androidShadow:{
        elevation: 5,
        zIndex: 99,
        shadowColor:'black',
    }
});

export default UploadPage;

const ResourceCard = ({fileName, uri, onDelete}) => {
    let resourceName;
    if(fileName.length > 16){
        resourceName = fileName.substring(0,16) + "...";
    }else{
        resourceName = fileName;
    }
    return(
        <View style={{flexDirection:"row", justifyContent:"flex-start", flex:1, marginHorizontal: 30, marginVertical:8, backgroundColor:"#E6E6E6"}}>
            <Image source={{uri:uri}} width={75} height={75}/>
            <Text style={{padding:15, textAlignVertical:"center", flex:1}}>{resourceName}</Text>
            
            <MaterialCommunityIcons.Button onPress={onDelete} name="image-remove" size={24} color="black" backgroundColor={"#00000000"} style={{height:"100%"}}/>
        </View>
    )
}