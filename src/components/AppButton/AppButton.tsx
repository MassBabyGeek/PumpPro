import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import appColors from '../../assets/colors';

type AppButtonProps = {
  text: string;
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPress?: () => void;
  disabled?: boolean;
  outlined?: boolean; // ✅ Ajout ici
};

const AppButton = ({
  text,
  borderColor = appColors.primary,
  backgroundColor = appColors.primary,
  fontSize = 14,
  paddingVertical = 10,
  paddingHorizontal = 10,
  onPress,
  disabled = false,
  outlined = false, // ✅ Par défaut non
}: AppButtonProps) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View
        style={[
          style.container,
          {
            borderColor: borderColor,
            backgroundColor: outlined ? 'transparent' : backgroundColor, // ✅ transparence si outlined
          },
        ]}>
        <Text
          style={[
            style.text,
            {
              fontSize: fontSize,
              paddingVertical: paddingVertical,
              paddingHorizontal: paddingHorizontal,
              color: outlined ? borderColor : appColors.textPrimary, // ✅ couleur adaptée
            },
          ]}>
          {text.toLocaleUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    borderRadius: 25,
    borderWidth: 0.3,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    paddingHorizontal: 10,
    color: appColors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AppButton;
