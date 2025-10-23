import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';
import {LeaderboardEntry} from '../../../services/api';

type MetricOption = {value: string; label: string; suffix: string};

type Props = {
  item: LeaderboardEntry;
  index: number;
  metric: string;
  metricOptions: MetricOption[];
};

const LeaderboardItem = ({item, index, metric, metricOptions}: Props) => {
  const navigation = useNavigation<any>();
  const isTop3 = item.rank <= 3;
  const isEven = index % 2 === 0;

  useEffect(() => {
    console.log('[LeaderboardItem] item', metric);
    console.log('[LeaderboardItem] item', item);
  }, [metric, item]);

  const handlePress = () => {
    navigation.navigate('UserProfile', {
      userId: item.userId,
      userName: item.userName,
    });
  };

  const currentMetric = metricOptions.find(m => m.value === metric);
  let itemValue = item.score;

  switch (metric) {
    case 'total-pushups':
      itemValue = item.score;
      break;
    case 'total-workouts':
      itemValue = item.totalSessions;
      break;
    case 'total-calories':
      itemValue = item.totalCalories;
      break;
    case 'max-reps':
      itemValue = item.bestSessionReps;
      break;
    case 'max-streak':
      itemValue = item.currentStreak;
      break;
  }

  const rankBadgeStyle = isTop3
    ? {
        backgroundColor:
          item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : '#CD7F32',
      }
    : {backgroundColor: appColors.border};

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: `${appColors.border}20`,
        backgroundColor: isEven ? `${appColors.border}10` : undefined,
      }}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1}}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            ...rankBadgeStyle,
          }}>
          {isTop3 ? (
            <Text style={{fontSize: 20}}>
              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: appColors.textSecondary,
              }}>
              {item.rank}
            </Text>
          )}
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: appColors.textPrimary,
            }}>
            {item.userName}
          </Text>
          {item.change !== 0 && item.change !== undefined && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                marginTop: 2,
              }}>
              <Icon
                name={
                  item.change > 0 ? 'arrow-up-outline' : 'arrow-down-outline'
                }
                size={12}
                color={item.change > 0 ? appColors.success : appColors.error}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: item.change > 0 ? appColors.success : appColors.error,
                }}>
                {Math.abs(item.change)}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <Text
          style={{fontSize: 18, fontWeight: 'bold', color: appColors.primary}}>
          {typeof itemValue === 'number'
            ? itemValue.toLocaleString()
            : itemValue}
          {currentMetric?.suffix}
        </Text>
        <Icon
          name="chevron-forward"
          size={20}
          color={appColors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};
export default LeaderboardItem;
