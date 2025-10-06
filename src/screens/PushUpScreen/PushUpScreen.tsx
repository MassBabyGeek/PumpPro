import React, {useState} from 'react';
import {Text, View, StyleSheet, Animated} from 'react-native';
import AppTitle from '../../components/AppTitle/AppTitle';
import AppButton from '../../components/AppButton/AppButton';
import appColors from '../../assets/colors';
import PushUpCamera from '../../components/PushUpCamera/PushUpCamera';
import {useNavigation} from '@react-navigation/native';
import {useTimer} from '../../hooks/useTimer';
import {useWorkoutStats} from '../../hooks/useWorkoutStats';
import {formatTime} from '../../utils/workout.utils';
import {TrainingScreenNavigationProp} from '../../types/navigation.types';

const PushUpScreen = () => {
  const navigation = useNavigation<TrainingScreenNavigationProp>();
  const {elapsedTime, isActive, toggle} = useTimer();
  const {
    pushUpCount,
    setPushUpCount,
    recordPushUp,
    calculateCalories,
    calculateSpeed,
  } = useWorkoutStats();
  const [distance, setDistance] = useState<number | null>(null);

  const calories = calculateCalories(pushUpCount);

  const handleStop = () => {
    navigation.navigate('PushUpSummary', {
      pushUpCount,
      elapsedTime,
      calories,
    });
  };

  return (
    <View style={styles.container}>
      <PushUpCamera
        isActive={isActive}
        setPushUpCount={setPushUpCount}
        setDistance={setDistance}
      />

      <AppTitle text="Training Push Up - Libre" />

      <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>

      <View>
        <Animated.View style={[styles.counterCircle]}>
          <Text style={styles.counterText}>{pushUpCount}</Text>
        </Animated.View>
      </View>

      {/* Indicateur de distance */}
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceLabel}>Distance</Text>
        <View style={styles.distanceBar}>
          <View
            style={[
              styles.distanceFill,
              {width: `${distance ?? 0}%`},
            ]}
          />
          <Text style={styles.distanceText}>
            {distance !== null ? `${distance}/100` : '-'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statText}>🔥 Calories: {calories}</Text>
        <Text style={styles.statText}>⏱ Temps: {elapsedTime}s</Text>
        <Text style={styles.statText}>🏅 Record: {recordPushUp}</Text>
        <Text style={styles.statText}>
          ⚡ Vitesse: {calculateSpeed(isActive ? Date.now() : null)}
        </Text>
      </View>
      <View style={styles.buttonsRow}>
        <AppButton
          text={isActive ? 'Pause' : 'Start'}
          fontSize={15}
          outlined={true}
          paddingHorizontal={50}
          paddingVertical={20}
          onPress={toggle}
        />

        <AppButton
          text="Stop"
          paddingHorizontal={50}
          paddingVertical={20}
          fontSize={15}
          onPress={handleStop}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    alignItems: 'center',
  },
  timer: {
    fontSize: 50,
    color: appColors.primary,
    marginBottom: 20,
  },
  counterCircle: {
    width: 300,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderColor: appColors.textSecondary,
    marginVertical: 30,
  },
  counterText: {
    fontSize: 50,
    color: appColors.primary,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 10,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  statText: {
    fontSize: 16,
    color: appColors.textSecondary,
  },
  distanceContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  distanceLabel: {
    fontSize: 18,
    color: appColors.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  distanceBar: {
    width: '100%',
    height: 40,
    backgroundColor: appColors.textSecondary + '30',
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  distanceFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: appColors.primary,
    borderRadius: 20,
  },
  distanceText: {
    fontSize: 16,
    color: appColors.background,
    fontWeight: 'bold',
    zIndex: 1,
  },
});

export default PushUpScreen;
