import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Skeleton, SkeletonCircle} from '../../../components/Skeleton/Skeleton';
import appColors from '../../../assets/colors';

const HomeScreenSkeleton = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Skeleton width={180} height={28} />
          <Skeleton width={200} height={16} style={{marginTop: 8}} />
        </View>
        <SkeletonCircle size={40} />
      </View>

      {/* Quote Card */}
      <View style={styles.card}>
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} style={{marginTop: 8}} />
        <Skeleton width="70%" height={14} style={{marginTop: 8}} />
      </View>

      {/* Streak Section */}
      <View style={styles.streakCard}>
        <View style={styles.streakItem}>
          <Skeleton width={60} height={36} />
          <Skeleton width={80} height={12} style={{marginTop: 8}} />
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.streakItem}>
          <Skeleton width={60} height={36} />
          <Skeleton width={100} height={12} style={{marginTop: 8}} />
        </View>
      </View>

      {/* Today Stats */}
      <View style={styles.section}>
        <Skeleton width={150} height={20} style={{marginBottom: 12}} />
        <View style={styles.statsGrid}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={styles.statCard}>
              <SkeletonCircle size={48} />
              <Skeleton width={60} height={28} style={{marginTop: 12}} />
              <Skeleton width={80} height={12} style={{marginTop: 6}} />
            </View>
          ))}
        </View>
      </View>

      {/* Quick Programs */}
      <View style={styles.section}>
        <Skeleton width={180} height={20} style={{marginBottom: 12}} />
        <View style={styles.programsRow}>
          {[1, 2].map(i => (
            <View key={i} style={styles.programCard}>
              <Skeleton width="100%" height={80} borderRadius={12} />
              <Skeleton
                width="80%"
                height={16}
                style={{marginTop: 12, alignSelf: 'center'}}
              />
              <Skeleton
                width="60%"
                height={12}
                style={{marginTop: 6, alignSelf: 'center'}}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Weekly Stats Graph */}
      <View style={styles.section}>
        <Skeleton width={200} height={20} style={{marginBottom: 12}} />
        <View style={styles.card}>
          <View style={styles.graphBars}>
            {[70, 50, 85, 60, 95, 75, 90].map((height, i) => (
              <View key={i} style={styles.graphBarContainer}>
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

      {/* Recent Workouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width={150} height={20} />
          <Skeleton width={80} height={16} />
        </View>
        {[1, 2, 3].map(i => (
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

      {/* Leaderboard */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width={120} height={20} />
          <Skeleton width={80} height={16} />
        </View>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.leaderboardItem}>
            <View style={styles.leaderboardLeft}>
              <Skeleton width={30} height={20} />
              <SkeletonCircle size={44} />
              <Skeleton width={100} height={16} />
            </View>
            <Skeleton width={60} height={20} />
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  streakCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
  },
  streakDivider: {
    width: 1,
    backgroundColor: `${appColors.border}50`,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  programsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  programCard: {
    flex: 1,
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  graphBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomSpacing: {
    height: 60,
  },
});

export default HomeScreenSkeleton;
