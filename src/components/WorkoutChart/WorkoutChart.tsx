import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import appColors from '../../assets/colors';
import {ChartPeriod} from '../../types/user.types';
import {useUser, useUserProfile} from '../../hooks';
import LoadingView from '../LoadingView/LoadingView';

const screenWidth = Dimensions.get('window').width;

type WorkoutChartProps = {
  userId?: string; // Si fourni, charge les données de cet utilisateur au lieu de l'utilisateur connecté
};

const WorkoutChart = ({userId}: WorkoutChartProps) => {
  // Si userId est fourni, utilise useUserProfile, sinon utilise useUser
  const currentUserData = useUser();
  const specificUserData = useUserProfile(userId || '');

  // Sélectionner les bonnes données selon si on regarde un profil spécifique ou le sien
  const {chartData, loadChartData, isChartLoading, user} = userId
    ? specificUserData
    : currentUserData;

  const [period, setPeriod] = useState<ChartPeriod>('week');

  useEffect(() => {
    if (user || userId) {
      loadChartData(period);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, user, userId]);

  const chartConfig = {
    backgroundColor: appColors.background,
    backgroundGradientFrom: appColors.background,
    backgroundGradientTo: appColors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(176, 179, 184, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progression</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'week' && styles.activePeriod,
            ]}
            onPress={() => setPeriod('week')}>
            <Text
              style={[
                styles.periodText,
                period === 'week' && styles.activePeriodText,
              ]}>
              Semaine
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'month' && styles.activePeriod,
            ]}
            onPress={() => setPeriod('month')}>
            <Text
              style={[
                styles.periodText,
                period === 'month' && styles.activePeriodText,
              ]}>
              Mois
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'year' && styles.activePeriod,
            ]}
            onPress={() => setPeriod('year')}>
            <Text
              style={[
                styles.periodText,
                period === 'year' && styles.activePeriodText,
              ]}>
              Année
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isChartLoading ? (
        <LoadingView />
      ) : (
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: appColors.background,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  activePeriod: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  periodText: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  activePeriodText: {
    color: appColors.background,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});

export default WorkoutChart;
