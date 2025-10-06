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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  actionText: {
    fontSize: 14,
    color: appColors.primary,
    fontWeight: '600',
  },
});

export default SectionTitle;
