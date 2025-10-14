import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import {useChallenges} from '../../hooks';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import {Challenge} from '../../types/challenge.types';
import {useNavigation} from '@react-navigation/native';
import {ChallengeScreenNavigationProp} from '../../types/navigation.types';
import ChallengeHeader from './component/ChallengeHeader';
import SearchBar from './component/SearchBar';
import FiltersSection from './component/FiltersSection';
import LoaderScreen from '../LoaderScreen/LoaderScreen';
import {FadeInView} from '../../components';
import Footer from '../../components/Footer';

const ChallengeScreen = () => {
  const navigation = useNavigation<ChallengeScreenNavigationProp>();
  const {
    challenges,
    isLoading,
    filters,
    stats,
    toggleCategory,
    toggleDifficulty,
    setSortBy,
    resetFilters,
    toggleLike,
    refreshChallenges,
    updateFilters,
  } = useChallenges();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilters({searchQuery: text});
  };

  // Handle challenge press - navigate to detail
  const handleChallengePress = (challenge: Challenge) => {
    navigation.navigate('ChallengeDetail', {challengeId: challenge.id});
  };

  if (isLoading) {
    return <LoaderScreen />;
  }

  if (!challenges || challenges?.length === 0) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshChallenges}
              tintColor={appColors.primary}
            />
          }>
          <ChallengeHeader stats={stats} />

          <SearchBar value={searchQuery} onChangeText={handleSearch} />

          <FiltersSection
            filters={filters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onResetFilters={resetFilters}
            onSortByChange={setSortBy}
            onCategoryToggle={toggleCategory}
            onDifficultyToggle={toggleDifficulty}
          />

          <EmptyState
            icon="trophy-outline"
            title="Bientôt disponible"
            message="Les challenges arrivent bientôt ! Nous travaillons dessus pour vous offrir la meilleure expérience."
            isLoading={isLoading}
          />

          <Footer />
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradient}>
      <FadeInView>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshChallenges}
              tintColor={appColors.primary}
            />
          }>
          {/* Header */}
          <ChallengeHeader stats={stats} />

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChangeText={handleSearch} />

          {/* Filters */}
          <FiltersSection
            filters={filters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onResetFilters={resetFilters}
            onSortByChange={setSortBy}
            onCategoryToggle={toggleCategory}
            onDifficultyToggle={toggleDifficulty}
          />

          {/* Challenges List */}
          <View style={styles.challengesList}>
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onPress={handleChallengePress}
                onLike={toggleLike}
              />
            ))}
          </View>

          <Footer />

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </FadeInView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${appColors.textSecondary}20`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${appColors.textSecondary}20`,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${appColors.textSecondary}30`,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.textPrimary,
    paddingVertical: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButton: {
    fontSize: 13,
    color: appColors.primary,
    fontWeight: '600',
  },
  filtersSection: {
    marginBottom: 16,
    gap: 16,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  activeFilters: {
    backgroundColor: `${appColors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  activeFiltersText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
  challengesList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: appColors.textSecondary,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 60,
  },
});

export default ChallengeScreen;
