import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type Props = {
  restTimeRemaining: number;
};

const RestingView = ({restTimeRemaining}: Props) => {
  return (
    <View style={styles.mainContent}>
      <View style={styles.restContainer}>
        <Icon
          name="pause-circle"
          size={70}
          color={appColors.warning}
          style={styles.restIcon}
        />
        <Text style={styles.restLabel}>TEMPS DE REPOS</Text>
        <Text style={styles.restTimer}>{restTimeRemaining}s</Text>
        <Text style={styles.restSubtext}>Respirez profondément</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    alignItems: 'center',
  },
  restContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  restIcon: {
    marginBottom: 16,
  },
  restLabel: {
    fontSize: 24,
    color: appColors.warning,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 2,
  },
  restTimer: {
    fontSize: 64,
    color: appColors.warning,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  restSubtext: {
    fontSize: 16,
    color: appColors.textSecondary,
    fontStyle: 'italic',
  },
});

export default RestingView;
