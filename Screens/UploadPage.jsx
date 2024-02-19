import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Pressable , FlatList} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { RawButton, ScrollView } from 'react-native-gesture-handler';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

const ITEMLIST = [
    {
        fileName:"test.png"
    },
    {
        fileName:"test2.png"
    }
]

const UploadPage = () => {
    const theme = useTheme();

    return (
        <View style={{padding:15}}>
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

            }}>
                <Text style={{color:"#3CCDB7", fontSize:19, width: '100%', height: 75, textAlignVertical:'center', textAlign:'center'}}>+ Add Media</Text>
            </Pressable>
            <FlatList 
                data={ITEMLIST}
                renderItem={({item}) => <ResourceCard fileName={item.fileName}/>}
            />
            <View style={{paddingTop:15, width: 100, height: 100}}>
                <Button title="Upload" disabled />
            </View>
        </View>
    
    )
}

const styles = StyleSheet.create({
    field:{
        margin: 500,
        padding: 50,
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
        <View style={{marginHorizontal: 30, marginVertical:10, backgroundColor:"#E6E6E6", borderWidth:.25}}>
            <Text style={{padding:15}}>{fileName}</Text>
        </View>
    )
}