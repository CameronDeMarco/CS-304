import 'react-native-gesture-handler';
import { useState } from 'react';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { primaryColor } from './Color';

export const useDarkMode = () => {
    const [isDarkMode, setDarkMode] = useState(false);
    const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        listText: '#222222',
        primary: '#CD553B',
        background: '#222222',
        text: 'white',
        itemContainer: '#ffffff',
        button: '#CD553B',
        secondary: '#000000',
        inputField: 'grey',
        popup: 'black',
        icon: '#CD553B',
    },
    };
    const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        listText: '#264653',
        primary: '#CD553B',
        background: 'white',
        text: 'black',
        itemContainer: 'white',
        button: 'black',
        secondary: '#264653',
        inputField: 'White',
        popup: 'white',
        icon: '#CD553B',
    },
    };

    const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    };

    const switchThumbColor = isDarkMode ? '#000000' : 'gray';
    const switchTrackColor = isDarkMode ? { false: '#C0C0C0', true: '#C0C0C0' } : { false: '#6495ED', true: '#C0C0C0' };

    const theme = isDarkMode ? CustomDarkTheme : CustomLightTheme;
    return {
    isDarkMode,
    toggleDarkMode,
    switchThumbColor,
    switchTrackColor,
    theme,
};
};