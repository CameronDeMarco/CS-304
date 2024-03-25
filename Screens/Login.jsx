import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RegisterButton = () => {
    const navigation = useNavigation();
  
    const handleCreateAccount = () => {
      navigation.navigate('Register');
    };
  
    return (
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.text}>Create Account</Text>
      </TouchableOpacity>
    );
  }

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Send login request to backend
      const response = await axios.post('http://10.20.146.243:5001/api/user/login', {
        username,
        password
      });
  
      // Check if response is successful
      if (response && response.data && response.data.token) {
        // Store token securely
        await AsyncStorage.setItem('token', response.data.token);

        Alert.alert(`Successfully logged in as ${username}`);
        
        // Navigate to another screen
        navigation.navigate('Feed');
      } else {
        // Handle invalid response
        console.error('Invalid response:', response);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response) {
        // Server responded with an error status code
        Alert.alert('Error', error.response.data.message || 'Failed to login. Please try again later.');
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Error', 'Network Error. Please check your internet connection.');
      } else {
        // Something else happened
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleCreateAccount = () => {
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonContainer}>
        <RegisterButton style={styles.button}/>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    height: 40,
    backgroundColor: '#4C6E95',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 8, 
  },
  text: {
    color: 'white',
  }
});

export default Login;
