import React from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';

interface LogoProps {
  size?: number;
  containerStyle?: ViewStyle;
}

const Logo: React.FC<LogoProps> = ({size = 120, containerStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={require('../../assets/images/logoProNB.png')}
        style={[
          styles.logo,
          {
            width: size,
            height: size,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // width and height are set dynamically via props
  },
});

export default Logo;
