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
import {useUser} from '../../hooks';
import LoadingView from '../LoadingView/LoadingView';

const screenWidth = Dimensions.get('window').width;

const WorkoutChart = () => {
  const {chartData, loadChartData, isChartLoading, user} = useUser();
  const [period, setPeriod] = useState<ChartPeriod>('week');

  useEffect(() => {
    if (user) {
      loadChartData(period);
    }
  }, [period, user]);

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
      r: '6',
      strokeWidth: '2',
      stroke: appColors.primary,
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
