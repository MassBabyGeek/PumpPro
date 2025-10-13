import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import appColors from '../../../assets/colors';

type MotivationCardProps = {
  totalReps: number;
};

const MotivationCard = ({totalReps}: MotivationCardProps) => {
  const getMotivationMessage = () => {
    if (totalReps >= 100) return '🏆 Performance incroyable !';
    if (totalReps >= 50) return '💪 Excellent travail !';
    if (totalReps >= 20) return '👍 Bon effort !';
    return '🎯 Continue comme ça !';
  };

  return (
    <View style={styles.motivationCard}>
      <Text style={styles.motivationText}>{getMotivationMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  motivationCard: {
    backgroundColor: `${appColors.primary}20`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primary,
    textAlign: 'center',
  },
});

export default MotivationCard;
