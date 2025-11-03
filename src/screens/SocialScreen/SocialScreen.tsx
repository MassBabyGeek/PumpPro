import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {useTabBarHeight} from '../../hooks';

const SocialScreen = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const {contentPaddingBottom} = useTabBarHeight();

  // Skeleton loader for activity card
  const SkeletonActivityCard = () => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={styles.activityUser}>
          <View style={[styles.avatar, styles.skeleton]} />
          <View style={styles.activityUserInfo}>
            <View style={[styles.skeletonLine, {width: 120}]} />
            <View style={[styles.skeletonLine, {width: 80, marginTop: 6}]} />
          </View>
        </View>
        <View style={[styles.activityTypeIcon, styles.skeleton]} />
      </View>
      <View style={styles.activityContent}>
        <View style={[styles.skeletonLine, {width: '100%'}]} />
        <View style={[styles.skeletonLine, {width: '70%', marginTop: 8}]} />
      </View>
      <View style={styles.activityActions}>
        <View style={[styles.skeletonLine, {width: 40}]} />
        <View style={[styles.skeletonLine, {width: 40}]} />
        <View style={[styles.skeletonLine, {width: 40}]} />
      </View>
    </View>
  );

  // Skeleton loader for friend card
  const SkeletonFriendCard = () => (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <View style={[styles.avatar, styles.skeleton]} />
        <View style={styles.friendDetails}>
          <View style={[styles.skeletonLine, {width: 100}]} />
          <View style={[styles.skeletonLine, {width: 80, marginTop: 6}]} />
          <View style={[styles.skeletonLine, {width: 90, marginTop: 6}]} />
        </View>
      </View>
      <View style={[styles.friendActionButton, styles.skeleton]} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.7}
            disabled>
            <Icon name="search" size={24} color={appColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.7}
            disabled>
            <Icon
              name="person-add-outline"
              size={24}
              color={appColors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
          activeOpacity={0.7}>
          <Icon
            name={activeTab === 'feed' ? 'newspaper' : 'newspaper-outline'}
            size={20}
            color={
              activeTab === 'feed' ? appColors.primary : appColors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'feed' && styles.tabTextActive,
            ]}>
            Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          onPress={() => setActiveTab('friends')}
          activeOpacity={0.7}>
          <Icon
            name={activeTab === 'friends' ? 'people' : 'people-outline'}
            size={20}
            color={
              activeTab === 'friends'
                ? appColors.primary
                : appColors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'friends' && styles.tabTextActive,
            ]}>
            Amis
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' ? (
          <>
            {/* Stats banner placeholder */}
            <View style={styles.statsBanner}>
              <View style={styles.statItem}>
                <Icon name="people" size={24} color={appColors.textSecondary} />
                <View
                  style={[styles.skeletonLine, {width: 40, marginTop: 8}]}
                />
                <View
                  style={[styles.skeletonLine, {width: 60, marginTop: 6}]}
                />
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="flame" size={24} color={appColors.textSecondary} />
                <View
                  style={[styles.skeletonLine, {width: 40, marginTop: 8}]}
                />
                <View
                  style={[styles.skeletonLine, {width: 80, marginTop: 6}]}
                />
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="trophy" size={24} color={appColors.textSecondary} />
                <View
                  style={[styles.skeletonLine, {width: 40, marginTop: 8}]}
                />
                <View
                  style={[styles.skeletonLine, {width: 70, marginTop: 6}]}
                />
              </View>
            </View>

            {/* Activities feed placeholder */}
            <View style={styles.feedSection}>
              <Text style={styles.sectionTitle}>Activités récentes</Text>
              <SkeletonActivityCard />
              <SkeletonActivityCard />
              <SkeletonActivityCard />

              {/* Coming soon message */}
              <View style={styles.comingSoonCard}>
                <Icon name="rocket" size={48} color={appColors.primary} />
                <Text style={styles.comingSoonTitle}>Bientôt disponible</Text>
                <Text style={styles.comingSoonText}>
                  Les fonctionnalités sociales arriveront très prochainement.
                  Partage tes sessions, défie tes amis et grimpe dans le
                  classement !
                </Text>
              </View>

              <View style={{height: contentPaddingBottom}} />
            </View>
          </>
        ) : (
          <>
            {/* Friends placeholder */}
            <View style={styles.friendsSection}>
              <Text style={styles.sectionTitle}>Amis</Text>
              <SkeletonFriendCard />
              <SkeletonFriendCard />
              <SkeletonFriendCard />
              <SkeletonFriendCard />

              {/* Coming soon message */}
              <View style={styles.comingSoonCard}>
                <Icon name="people" size={48} color={appColors.primary} />
                <Text style={styles.comingSoonTitle}>
                  Connecte-toi avec tes amis
                </Text>
                <Text style={styles.comingSoonText}>
                  Bientôt, tu pourras ajouter des amis, voir leurs activités et
                  vous motiver mutuellement dans vos entraînements !
                </Text>
              </View>

              <View style={{height: contentPaddingBottom}} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tabs
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: appColors.backgroundLight,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: `${appColors.primary}15`,
    borderColor: appColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  tabTextActive: {
    color: appColors.primary,
  },
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 0,
  },
  // Stats banner
  statsBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: appColors.backgroundLight,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: `${appColors.border}50`,
  },
  // Sections
  feedSection: {
    paddingHorizontal: 20,
  },
  friendsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 16,
  },
  // Activity card
  activityCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${appColors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityUserInfo: {
    gap: 2,
  },
  activityTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${appColors.textSecondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    marginBottom: 12,
  },
  activityActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${appColors.border}50`,
  },
  // Friend card
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  friendDetails: {
    flex: 1,
    gap: 2,
  },
  friendActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${appColors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Skeleton styles
  skeleton: {
    backgroundColor: `${appColors.textSecondary}20`,
    overflow: 'hidden',
  },
  skeletonLine: {
    height: 12,
    backgroundColor: `${appColors.textSecondary}20`,
    borderRadius: 6,
  },
  // Coming soon card
  comingSoonCard: {
    backgroundColor: appColors.backgroundLight,
    borderRadius: 16,
    padding: 32,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: `${appColors.primary}30`,
    borderStyle: 'dashed',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SocialScreen;
