import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Skeleton, SkeletonCircle} from '../../../components/Skeleton/Skeleton';
import appColors from '../../../assets/colors';

const ProfileScreenSkeleton = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width={150} height={28} />
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeaderCard}>
        <SkeletonCircle size={100} />
        <Skeleton width={150} height={24} style={{marginTop: 16}} />
        <Skeleton width={120} height={14} style={{marginTop: 8}} />
        <Skeleton width={180} height={14} style={{marginTop: 4}} />
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.quickStatItem}>
            <Skeleton width={60} height={32} />
            <Skeleton width={80} height={12} style={{marginTop: 8}} />
          </View>
        ))}
      </View>

      {/* Chart Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width={120} height={20} />
          <View style={styles.periodTabs}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} width={50} height={32} borderRadius={16} />
            ))}
          </View>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartBars}>
            {[65, 45, 80, 55, 90, 75, 100, 60].map((height, i) => (
              <View key={i} style={styles.chartBarContainer}>
                <Skeleton
                  width="100%"
                  height={height}
                  style={{alignSelf: 'flex-end'}}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Personal Info Section */}
      <View style={styles.section}>
        <Skeleton width={180} height={20} style={{marginBottom: 16}} />
        <View style={styles.infoCard}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <SkeletonCircle size={24} />
                <Skeleton width={100} height={14} style={{marginLeft: 12}} />
              </View>
              <Skeleton width={80} height={14} />
            </View>
          ))}
        </View>
      </View>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width={180} height={20} />
          <Skeleton width={80} height={16} />
        </View>
        {[1, 2].map(i => (
          <View key={i} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <SkeletonCircle size={50} />
              <View style={styles.workoutInfo}>
                <Skeleton width={120} height={16} />
                <Skeleton width={90} height={12} style={{marginTop: 6}} />
              </View>
            </View>
            <Skeleton width="100%" height={12} style={{marginTop: 12}} />
            <Skeleton width="80%" height={12} style={{marginTop: 6}} />
          </View>
        ))}
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Skeleton width={150} height={20} style={{marginBottom: 16}} />
        <View style={styles.actionsCard}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <SkeletonCircle size={40} />
                <View style={{marginLeft: 12}}>
                  <Skeleton width={120} height={16} />
                  <Skeleton width={160} height={12} style={{marginTop: 6}} />
                </View>
              </View>
              <SkeletonCircle size={24} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileHeaderCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 24,
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  periodTabs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chartCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 20,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    gap: 6,
  },
  chartBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  infoCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${appColors.border}30`,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  actionsCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${appColors.border}30`,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 60,
  },
});

export default ProfileScreenSkeleton;
