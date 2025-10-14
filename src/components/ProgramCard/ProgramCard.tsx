import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';

const {width} = Dimensions.get('window');

type ProgramCardProps = {
  title: string;
  description?: string;
  difficulty?: string;
  icon: string;
  color: string;
  onPress?: () => void;
  style?: any;
  usageCount?: number;
};

const ProgramCard = ({
  title,
  description,
  difficulty,
  icon,
  color,
  onPress,
  style,
  usageCount,
}: ProgramCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.touchable, style]}>
      <LinearGradient colors={[`${color}00`, `${color}80`]} style={styles.card}>
        <View style={styles.content}>
          <Icon name={icon} size={32} color={color} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
          <View style={styles.badgeContainer}>
            {difficulty && (
              <View style={styles.badge}>
                <Text style={[styles.reps, {color}]}>{difficulty}</Text>
              </View>
            )}
            {usageCount !== undefined && usageCount > 0 && (
              <View style={[styles.badge, styles.usageBadge]}>
                <Icon name="people" size={12} color={appColors.textSecondary} />
                <Text style={styles.usageText}>{usageCount}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    width: width * 0.4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: `${appColors.background}80`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  usageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reps: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  usageText: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
});

export default ProgramCard;
