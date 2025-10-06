import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import LinearGradient from 'react-native-linear-gradient';

type StatCardProps = {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
};

const StatCard = ({
  icon,
  label,
  value,
  unit,
  color = appColors.primary,
}: StatCardProps) => {
  return (
    <LinearGradient
      colors={[`${color}10`, `${color}20`]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[styles.container, {borderColor: color}]}>
      <Icon name={icon} size={24} color={color} style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    width: '48%',
    minHeight: 80,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  label: {
    fontSize: 11,
    color: appColors.textSecondary,
    marginBottom: 6,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  unit: {
    fontSize: 11,
    color: appColors.textSecondary,
  },
});

export default StatCard;
