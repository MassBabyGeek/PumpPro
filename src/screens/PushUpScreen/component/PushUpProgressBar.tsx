import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../../assets/colors';

interface PushUpProgressBarProps {
  value: number | null; // 0 à 100 ou null si pas de visage
  label?: string;
  width?: number | string;
  height?: number;
  labels: string[]; // [ok, ajustez, non détecté]
  shouldReset?: boolean; // Si true, affiche 0 au lieu de value
}

const PushUpProgressBar: React.FC<PushUpProgressBarProps> = ({
  value,
  label,
  width = '100%',
  height = 8,
  labels,
  shouldReset = false,
}) => {
  // Si shouldReset est true, on affiche 0, sinon la valeur normale (ou 0 si null)
  const displayValue = shouldReset ? 0 : (value ?? 0);
  // Conversion hex → rgb
  const hexToRgb = (hex: string) => {
    const cleaned = hex.replace('#', '');
    const bigint = parseInt(cleaned, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  // Interpolation linéaire entre deux couleurs
  const interpolateColor = (color1: string, color2: string, t: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r},${g},${b})`;
  };

  // ✨ Couleur INVERSÉE : rouge → jaune → bleu (au lieu de bleu → jaune → rouge)
  const getBarColor = (val: number) => {
    if (val <= 50) {
      // 0-50% : rouge → jaune
      return interpolateColor(appColors.error, appColors.warning, val / 50);
    } else {
      // 50-100% : jaune → bleu
      return interpolateColor(
        appColors.warning,
        appColors.primary,
        (val - 50) / 50,
      );
    }
  };

  // Vérifier si la valeur originale est null (pas de visage)
  const isNoFace = value === null;

  const displayText = isNoFace
    ? labels[2] // "Non détecté"
    : displayValue > 70
    ? labels[0] // "Position correcte"
    : labels[1]; // "Ajustez"

  const barWidth = isNoFace ? '0%' : `${displayValue}%`;
  const barColor = isNoFace ? appColors.textSecondary : getBarColor(displayValue);

  return (
    <View style={[styles.container, {width: width as number}]}>
      <View style={styles.distanceHeader}>
        <Icon
          name="eye-outline"
          size={18}
          color={appColors.primary}
          style={styles.distanceIcon}
        />
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
      <View style={[styles.barBackground, {height}]}>
        <View
          style={[
            styles.barFill,
            {
              width: barWidth,
              height,
              backgroundColor: barColor,
            },
          ]}
        />
        <Text style={styles.distanceText}>{displayText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 4,
  },
  barBackground: {
    width: '100%',
    backgroundColor: `${appColors.textSecondary}30`,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barFill: {
    borderRadius: 20,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  distanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  distanceIcon: {
    alignContent: 'center',
  },
  distanceText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
    color: appColors.textPrimary,
  },
});

export default PushUpProgressBar;
