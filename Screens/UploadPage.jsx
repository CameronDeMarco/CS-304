import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable , FlatList} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RawButton, ScrollView } from 'react-native-gesture-handler';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';


const UploadPage = () => {
    const theme = useTheme();
    const [ITEMLIST, setItem] = useState([]);

    function addFile(){
        setItem([...ITEMLIST, {fileName:"test.png"}]);
    }

    function selectMedia(){
        //TODO implement camera/galery options...
        //If user adds media call add file.
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
            <Pressable 
            onPressOut={()=>{
                addFile();
                selectMedia();
            }}>
                <Text style={{color:"#3CCDB7", fontSize:19, width: '100%', height: 75, textAlignVertical:'center', textAlign:'center'}}>+ Add Media</Text>
            </Pressable>
            <FlatList 
                scrollEnabled={false}
                data={ITEMLIST}
                renderItem={({item}) => <ResourceCard fileName={item.fileName}/>}
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
    }
});

export default UploadPage;

const ResourceCard = ({fileName}) => {
    return(
        <View style={{flexDirection:"row", justifyContent:"space-between", flex:1, marginHorizontal: 30, marginVertical:8, backgroundColor:"#E6E6E6", borderWidth:.25}}>
            <Text style={{padding:15}}>{fileName}</Text>
            <Pressable>
                <MaterialCommunityIcons.Button name="image-remove" size={24} color="black" backgroundColor={"#00000000"} style={{height:"100%"}}/>
            </Pressable>
        </View>
    )
}