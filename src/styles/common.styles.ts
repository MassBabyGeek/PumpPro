import {StyleSheet} from 'react-native';
import appColors from '../assets/colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 80,
    backgroundColor: appColors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.background,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const textStyles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  body: {
    fontSize: 16,
    color: appColors.textSecondary,
  },
  label: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  error: {
    fontSize: 14,
    color: appColors.error,
  },
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
