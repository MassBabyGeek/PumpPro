import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import AppButton from '../../components/AppButton/AppButton';
import appColors from '../../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  PushUpSummaryScreenRouteProp,
  PushUpSummaryScreenNavigationProp,
} from '../../types/navigation.types';
import {formatTime} from '../../utils/workout.utils';

type Props = {
  route: PushUpSummaryScreenRouteProp;
  navigation: PushUpSummaryScreenNavigationProp;
};

const PushUpSummaryScreen = ({route, navigation}: Props) => {
  return (
    <View style={styles.container}>
      {/* 🎉 Animation confettis */}
      <ConfettiCannon count={2000} origin={{x: 0, y: 0}} fadeOut />

      {/* ✅ Icône ou logo de succès */}
      <Icon
        name="checkmark-circle-outline"
        size={100}
        color={appColors.primary}
      />

      <Text style={styles.title}>Session terminée 🎯</Text>

      <View style={styles.summary}>
        <Text style={styles.stat}>👊 Pompes : {route.params.pushUpCount}</Text>
        <Text style={styles.stat}>⏱ Durée: {formatTime(route.params.elapsedTime)}</Text>
        <Text style={styles.stat}>🔥 Calories : {route.params.calories}</Text>
      </View>

      <AppButton
        text="Retour"
        onPress={() => navigation.navigate('Training')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: appColors.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summary: {
    marginVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  stat: {
    fontSize: 18,
    color: appColors.textSecondary,
  },
});

export default PushUpSummaryScreen;
