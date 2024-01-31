import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

const AccountPage = () => {
  const theme = useTheme();

  return (
    <View>
        <Text>Feed page</Text>
    </View>
  );
};

export default AccountPage;
