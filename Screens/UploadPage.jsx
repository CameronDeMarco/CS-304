import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable , FlatList, Image} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';


const UploadPage = () => {
    const theme = useTheme();
    const [mediaRefrences, setMediaRefrences] = useState([]);

    function addMedia(fileName, uri){
        setMediaRefrences([...mediaRefrences, {fileName:fileName, uri:uri}]);
    }

    const deleteMedia = (mediaRefrence) => {
        console.log("delete " + mediaRefrence.fileName);
        setMediaRefrences(mediaRefrences.filter((search) => search.fileName !==  mediaRefrence.fileName));
    }

    async function openCamera(){
        let result = await ImagePicker.launchCameraAsync();
        if(!result.canceled){
            console.log(result.assets[0].fileName + " selected.");
            addMedia(result.assets[0].fileName, result.assets[0].uri);
            console.log(result.assets[0]);
        }else{
            console.log("Media selection cancled.");
        }
    }

    async function openGallery(){
        let result = await ImagePicker.launchImageLibraryAsync();

        if(!result.canceled){
            console.log(result.assets[0].fileName + " selected.");
            addMedia(test=result.assets[0].fileName, result.assets[0].uri);
            console.log(result.assets[0]);
        }else{
            console.log("Media selection cancled.");
        }
    }

    return (
        <ScrollView style={{padding:15}}>
            <View styles={styles.field}>
                <Text style={styles.textField}>Title</Text>
                <TextInput maxLength={50} style={[styles.textInput, styles.androidShadow]}></TextInput>
            </View>
            <View styles={styles.field}>
                <Text style={styles.textField}>Description</Text>
                <TextInput maxLength={150} style={[styles.multiTextInput, styles.androidShadow]} multiline></TextInput>
            </View>
            <Text style={{fontWeight:"bold", fontSize:22, textDecorationLine:"underline", textAlign:'center', marginTop:20, marginBottom:5}}>Media</Text>
            <View style={{flexDirection:"row", justifyContent:"center"}}>
                <Pressable
                style={{marginHorizontal:15}}
                onPressOut={()=>{
                    openCamera();
                }}>
                    <Text styles={styles.mediaButton}>+ Camera</Text>
                </Pressable>
                <Pressable 
                style={{marginHorizontal:15}}
                onPressOut={()=>{
                    openGallery();
                }}>
                <Text styles={styles.mediaButton}>+ Gallery</Text>
                </Pressable>
            </View>
            <FlatList 
                scrollEnabled={false}
                data={mediaRefrences}
                renderItem={({item}) => <ResourceCard fileName={item.fileName} uri={item.uri} onDelete={() => {deleteMedia(item)}}/>}
            />
            <View style={{paddingTop:15, width: 100, height: 100}}>
                <Button title="Upload" disabled />
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
    },
    mediaButton:{
        color:"#3CCDB7",
        width:"100%",
        fontSize:19,
        marginBottom:25,
        textAlignVertical:'center'
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