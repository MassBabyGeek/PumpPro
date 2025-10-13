import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import appColors from '../../../assets/colors';
import FilterChip from '../../../components/FilterChip/FilterChip';
import {SectionTitle} from '../../../components';
import {
  CATEGORY_LABELS,
  SORT_LABELS,
  ChallengeSortBy,
  ChallengeCategory,
} from '../../../types/challenge.types';
import {DIFFICULTY_LABELS, DifficultyLevel} from '../../../types/workout.types';

type ChallengeFilters = {
  sortBy: ChallengeSortBy;
  category: ChallengeCategory | null;
  difficulty: DifficultyLevel | null;
  searchQuery: string;
};

type FiltersSectionProps = {
  filters: ChallengeFilters;
  showFilters: boolean;
  onToggleFilters: () => void;
  onResetFilters: () => void;
  onSortByChange: (sort: ChallengeSortBy) => void;
  onCategoryToggle: (category: ChallengeCategory) => void;
  onDifficultyToggle: (difficulty: DifficultyLevel) => void;
};

const FiltersSection = ({
  filters,
  showFilters,
  onToggleFilters,
  onResetFilters,
  onSortByChange,
  onCategoryToggle,
  onDifficultyToggle,
}: FiltersSectionProps) => {
  return (
    <>
      {/* Filters Toggle */}
      <View style={styles.filterHeader}>
        <SectionTitle
          title="Filtres"
          actionText={showFilters ? 'Masquer' : 'Afficher'}
          onActionPress={onToggleFilters}
        />
        {(filters.category || filters.difficulty) && (
          <Text style={styles.resetButton} onPress={onResetFilters}>
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
                  onPress={() => onSortByChange(sort)}
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
                    onPress={() => onCategoryToggle(category)}
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
                    onPress={() => onDifficultyToggle(difficulty)}
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
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default FiltersSection;
