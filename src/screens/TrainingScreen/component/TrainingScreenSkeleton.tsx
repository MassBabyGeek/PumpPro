import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Skeleton, SkeletonCircle} from '../../../components/Skeleton/Skeleton';
import appColors from '../../../assets/colors';

const TrainingScreenSkeleton = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width={150} height={28} />
        <Skeleton width={220} height={16} style={{marginTop: 8}} />
      </View>

      {/* Quote Card */}
      <View style={styles.quoteCard}>
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} style={{marginTop: 8}} />
      </View>

      {/* Difficulty Sections */}
      {[1, 2, 3].map(section => (
        <View key={section} style={styles.difficultySection}>
          {/* Section Title */}
          <View style={styles.sectionTitle}>
            <Skeleton width={120} height={22} />
          </View>

          {/* Programs List */}
          <View style={styles.programsList}>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.programCard}>
                <View style={styles.programContent}>
                  {/* Left Section */}
                  <View style={styles.programLeft}>
                    <SkeletonCircle size={24} />
                    <View style={styles.programInfo}>
                      <Skeleton width={140} height={18} />
                      <Skeleton width={100} height={13} style={{marginTop: 6}} />
                      <Skeleton width={80} height={12} style={{marginTop: 6}} />
                      <View style={styles.programMeta}>
                        <View style={styles.metaItem}>
                          <SkeletonCircle size={14} />
                          <Skeleton
                            width={80}
                            height={11}
                            style={{marginLeft: 4}}
                          />
                        </View>
                        <Skeleton width={40} height={20} borderRadius={10} />
                      </View>
                    </View>
                  </View>

                  {/* Right Icon */}
                  <SkeletonCircle size={24} />
                </View>
              </View>
            ))}
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
    paddingBottom: 20,
  },
  quoteCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  difficultySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  programsList: {
    gap: 16,
  },
  programCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginHorizontal: 20,
  },
  programContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  programInfo: {
    flex: 1,
    gap: 5,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 60,
  },
});

export default TrainingScreenSkeleton;
