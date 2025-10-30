import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, ViewStyle} from 'react-native';
import appColors from '../../assets/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        } as any,
        style,
        {opacity},
      ]}
    />
  );
};

export const SkeletonCircle: React.FC<{size?: number; style?: ViewStyle}> = ({
  size = 40,
  style,
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
};

export const SkeletonCard: React.FC<{style?: ViewStyle}> = ({style}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <SkeletonCircle size={50} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} style={{marginTop: 8}} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={{marginTop: 16}} />
      <Skeleton width="80%" height={12} style={{marginTop: 8}} />
      <Skeleton width="90%" height={12} style={{marginTop: 8}} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: `${appColors.textSecondary}20`,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
});

export default Skeleton;
