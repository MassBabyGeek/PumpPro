import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {useChallenges} from '../../hooks';
import ChallengeCard from '../../components/ChallengeCard/ChallengeCard';
import FilterChip from '../../components/FilterChip/FilterChip';
import {SectionTitle} from '../../components';
import {
  CATEGORY_LABELS,
  SORT_LABELS,
  ChallengeSortBy,
  ChallengeCategory,
  Challenge,
} from '../../types/challenge.types';
import {DIFFICULTY_LABELS, DifficultyLevel} from '../../types/workout.types';
import {useNavigation} from '@react-navigation/native';
import {PushUpScreenNavigationProp} from '../../types/navigation.types';

const ChallengeScreen = () => {
  const navigation = useNavigation<PushUpScreenNavigationProp>();
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
  const [showFilters, setShowFilters] = useState(true);

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilters({searchQuery: text});
  };

  // Handle challenge press - navigate to detail
  const handleChallengePress = (challenge: Challenge) => {
    navigation.navigate(
      'ChallengeDetail' as never,
      {challengeId: challenge.id} as never,
    );
  };

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.gradient}>
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
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>🏆 Challenges</Text>
            <Text style={styles.subtitle}>
              {stats.total} challenge{stats.total > 1 ? 's' : ''} disponible
              {stats.total > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <Icon
                name="checkmark-circle"
                size={16}
                color={appColors.success}
              />
              <Text style={styles.statBadgeText}>{stats.completed}</Text>
            </View>
            <View style={styles.statBadge}>
              <Icon name="star" size={16} color={appColors.warning} />
              <Text style={styles.statBadgeText}>{stats.totalPoints}</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color={appColors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un challenge..."
            placeholderTextColor={appColors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <Icon
              name="close-circle"
              size={20}
              color={appColors.textSecondary}
              onPress={() => handleSearch('')}
            />
          )}
        </View>

        {/* Filters Toggle */}
        <View style={styles.filterHeader}>
          <SectionTitle
            title="Filtres"
            actionText={showFilters ? 'Masquer' : 'Afficher'}
            onActionPress={() => setShowFilters(!showFilters)}
          />
          {(filters.category || filters.difficulty) && (
            <Text style={styles.resetButton} onPress={resetFilters}>
              Réinitialiser
            </Text>
          )}
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersSection}>
            {/* Sort By */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Trier par</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}>
                {(Object.keys(SORT_LABELS) as ChallengeSortBy[]).map(sort => (
                  <FilterChip
                    key={sort}
                    label={SORT_LABELS[sort]}
                    selected={filters.sortBy === sort}
                    onPress={() => setSortBy(sort)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Category Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Catégorie</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}>
                {(Object.keys(CATEGORY_LABELS) as ChallengeCategory[]).map(
                  category => (
                    <FilterChip
                      key={category}
                      label={CATEGORY_LABELS[category]}
                      selected={filters.category === category}
                      onPress={() => toggleCategory(category)}
                    />
                  ),
                )}
              </ScrollView>
            </View>

            {/* Difficulty Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Difficulté</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}>
                {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map(
                  difficulty => (
                    <FilterChip
                      key={difficulty}
                      label={DIFFICULTY_LABELS[difficulty]}
                      selected={filters.difficulty === difficulty}
                      onPress={() => toggleDifficulty(difficulty)}
                    />
                  ),
                )}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Active Filters Summary */}
        {(filters.category || filters.difficulty) && (
          <View style={styles.activeFilters}>
            <Text style={styles.activeFiltersText}>
              Filtres actifs:{' '}
              {filters.category && CATEGORY_LABELS[filters.category]}
              {filters.category && filters.difficulty && ' • '}
              {filters.difficulty && DIFFICULTY_LABELS[filters.difficulty]}
            </Text>
          </View>
        )}

        {/* Challenges List */}
        <View style={styles.challengesList}>
          {challenges.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name="search-outline"
                size={64}
                color={appColors.textSecondary}
              />
              <Text style={styles.emptyText}>Aucun challenge trouvé</Text>
              <Text style={styles.emptySubtext}>
                Essayez de modifier vos filtres
              </Text>
            </View>
          ) : (
            challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onPress={handleChallengePress}
                onLike={toggleLike}
              />
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    height: 40,
  },
});

export default ChallengeScreen;
