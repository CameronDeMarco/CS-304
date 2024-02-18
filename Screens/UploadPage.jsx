import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { RawButton, ScrollView } from 'react-native-gesture-handler';

const UploadPage = () => {
    const theme = useTheme();

    return (
        <View style={{padding:15}}>
            <View styles={styles.field}>
                <Text style={styles.textField}>Title</Text>
                <TextInput maxLength={50} style={{padding:5, borderWidth:1, fontSize:15}}></TextInput>
            </View>
            <ScrollView>
                <Text style={styles.textField}>Description</Text>
                <TextInput maxLength={150} style={styles.multiTextInput} multiline></TextInput>
            </ScrollView>
            <RawButton title="Add Media"></RawButton>
            <View style={{paddingTop:15, width: 100, height: 100}}>
                <Button title="Upload"  disabled />
            </View>
        </View>
    
    )
}

const styles = StyleSheet.create({
    field:{
        margin: 50,
        padding: 50
    },
    textField:{
        fontSize:16.5,
    },
    textInput:{
        padding:5, 
        borderWidth:1, 
        fontSize:15,
        height: 50,
    },

    multiTextInput:{
        padding: 5, 
        height: 75, 
        borderWidth:1, 
        fontSize:15, 
        textAlignVertical:"top"
    }
});

export default UploadPage;