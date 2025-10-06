import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';

const {width} = Dimensions.get('window');

type ProgramCardProps = {
  title: string;
  description: string;
  reps?: number;
  icon: string;
  color: string;
  onPress?: () => void;
  style?: any;
};

const ProgramCard = ({
  title,
  description,
  reps,
  icon,
  color,
  onPress,
  style,
}: ProgramCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={[`${color}00`, `${color}80`]}
        style={styles.card}>
        <View style={styles.content}>
          <Icon name={icon} size={32} color={color} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {reps && (
            <View style={styles.badge}>
              <Text style={[styles.reps, {color}]}>{reps} reps</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.4,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: `${appColors.background}80`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reps: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ProgramCard;
