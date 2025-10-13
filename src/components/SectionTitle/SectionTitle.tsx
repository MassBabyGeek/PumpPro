import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import appColors from '../../assets/colors';

type SectionTitleProps = {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: any;
};

const SectionTitle = ({
  title,
  actionText,
  onActionPress,
  style,
}: SectionTitleProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    color: appColors.textPrimary,
  },
  actionText: {
    fontSize: 12,
    alignContent: 'center',
    color: appColors.primary,
    fontWeight: '600',
  },
});

export default SectionTitle;
