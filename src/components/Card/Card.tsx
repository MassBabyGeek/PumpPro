import React, {ReactNode} from 'react';
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';

type CardProps = {
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  children: ReactNode;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPress: () => void;
};

const Card = ({
  color = appColors.primary,
  style,
  paddingHorizontal = 20,
  paddingVertical = 30,
  disabled = false,
  onPress,
  children,
}: CardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled} // Désactive l'appui si la card est désactivée
    >
      <LinearGradient
        colors={[`${color}10`, `${color}20`]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[
          styles.container,
          {borderColor: color, opacity: disabled ? 0.5 : 1},
        ]}>
        <View
          style={[
            {
              paddingVertical: paddingVertical,
              paddingHorizontal: paddingHorizontal,
            },
            style,
          ]}>
          {children}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    borderWidth: 0.2,
    minHeight: 60, // Ajout d'une hauteur minimale
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default Card;
