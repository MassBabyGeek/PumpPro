import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Skeleton, SkeletonCircle} from '../../../components/Skeleton/Skeleton';
import appColors from '../../../assets/colors';

const ChallengeScreenSkeleton = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.statCard}>
              <Skeleton width={60} height={32} />
              <Skeleton width={80} height={12} style={{marginTop: 8}} />
            </View>
          ))}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <SkeletonCircle size={20} />
          <Skeleton width="70%" height={16} style={{marginLeft: 12}} />
        </View>
        <View style={styles.filterButton}>
          <SkeletonCircle size={24} />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterChips}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} width={80} height={36} borderRadius={18} />
          ))}
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Skeleton width={150} height={20} />
        <Skeleton width={60} height={16} />
      </View>

      {/* Challenge Cards */}
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.challengeCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <SkeletonCircle size={50} />
              <View style={{marginLeft: 12}}>
                <Skeleton width={120} height={18} />
                <Skeleton width={80} height={12} style={{marginTop: 6}} />
              </View>
            </View>
            <View style={styles.difficultyBadge}>
              <Skeleton width={60} height={24} borderRadius={12} />
            </View>
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            <Skeleton width="100%" height={14} />
            <Skeleton width="90%" height={14} style={{marginTop: 6}} />
            <Skeleton width="70%" height={14} style={{marginTop: 6}} />
          </View>

          {/* Card Stats */}
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <SkeletonCircle size={16} />
              <Skeleton width={40} height={12} style={{marginLeft: 6}} />
            </View>
            <View style={styles.statItem}>
              <SkeletonCircle size={16} />
              <Skeleton width={50} height={12} style={{marginLeft: 6}} />
            </View>
            <View style={styles.statItem}>
              <SkeletonCircle size={16} />
              <Skeleton width={60} height={12} style={{marginLeft: 6}} />
            </View>
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.progressBar}>
              <Skeleton width="100%" height={6} borderRadius={3} />
            </View>
            <View style={styles.cardActions}>
              <SkeletonCircle size={36} />
              <Skeleton width={100} height={40} borderRadius={20} />
            </View>
          </View>
        </View>
      ))}

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
    paddingBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.backgroundLight,
    borderRadius: 12,
    padding: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: appColors.backgroundLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  challengeCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  difficultyBadge: {
    marginLeft: 12,
  },
  cardContent: {
    marginBottom: 16,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooter: {
    gap: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: `${appColors.textSecondary}10`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 60,
  },
});

export default ChallengeScreenSkeleton;
