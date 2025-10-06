import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';

type InfoCardProps = {
  icon: string;
  label: string;
  value: string | number;
  iconColor?: string;
  style?: any;
};

const InfoCard = ({
  icon,
  label,
  value,
  iconColor = appColors.primary,
  style,
}: InfoCardProps) => {
  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} size={20} color={iconColor} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: `${appColors.border}30`,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
});

export default InfoCard;
