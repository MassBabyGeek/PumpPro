import React from 'react';
import {ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';

type FadeInViewProps = {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
};

const FadeInView = ({
  children,
  duration = 600,
  style,
}: FadeInViewProps) => {
  const opacity = useSharedValue(0);

  // Trigger fade-in when screen comes into focus (including refresh/navigation)
  useFocusEffect(
    React.useCallback(() => {
      // Reset opacity to 0
      opacity.value = 0;
      // Animate to 1
      opacity.value = withTiming(1, {
        duration,
      });

      // Cleanup when screen loses focus
      return () => {
        opacity.value = 0;
      };
    }, [duration]),
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[{flex: 1}, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;
