import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type Props = {
  quote: string;
};

const MotivationalQuoteCard = ({quote}: Props) => {
  return (
    <LinearGradient
      colors={[`${appColors.primary}15`, `${appColors.accent}15`]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.quoteCard}>
      <View style={styles.quoteContent}>
        <Icon
          name="chatbox-ellipses"
          size={24}
          color={appColors.primary}
          style={styles.quoteIcon}
        />
        <Text style={styles.quoteText}>{quote}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  quoteCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  quoteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
  },
  quoteIcon: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 22,
    color: appColors.textPrimary,
    fontWeight: '500',
    width: '85%',
  },
});

export default MotivationalQuoteCard;
