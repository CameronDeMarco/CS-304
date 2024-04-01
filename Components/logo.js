import React from 'react';
import { Image } from 'react-native';

const Logo = () => {
  const logoSource = require('../assets/images/logo.png');
  console.log('Logo Source:', logoSource);
  return (
    <Image
      source={logoSource}
      style={{ width: 100, height: 100 }}
      resizeMode="contain"
    />
  );
};

export default Logo;
