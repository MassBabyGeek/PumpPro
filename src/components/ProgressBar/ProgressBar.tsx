import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabel = true,
  height = 8,
  color = appColors.primary,
  backgroundColor = `${appColors.textSecondary}30`,
  showPercentage = true,
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {current} / {total}
          </Text>
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.barContainer, {height, backgroundColor}]}>
        <LinearGradient
          colors={[color, `${color}CC`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.bar, {width: `${percentage}%`, height}]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: appColors.textPrimary,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 14,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  barContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 10,
  },
});

export default ProgressBar;
