import {StyleSheet, Text, View, ScrollView, RefreshControl} from 'react-native';
import {useState} from 'react';
import AppTitle from '../../components/AppTitle/AppTitle';
import appColors from '../../assets/colors';
import {TrainingScreenNavigationProp} from '../../types/navigation.types';
import {useNavigation} from '@react-navigation/native';
import {WorkoutProgram, DifficultyLevel} from '../../types/workout.types';
import QuoteCard from '../../components/QuoteCard/QuoteCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import LinearGradient from 'react-native-linear-gradient';
import ProgramsByDifficulty from './component/ProgramsByDifficulty';
import TrainingScreenSkeleton from './component/TrainingScreenSkeleton';
import {useWorkoutPrograms, usePrograms, useTabBarHeight} from '../../hooks';
import FadeInView from '../../components/FadeInView/FadeInView';
import Footer from '../../components/Footer';

const TrainingScreen = () => {
  const navigation = useNavigation<TrainingScreenNavigationProp>();
  const {programs, isLoading, error, getProgramIcon, updateProgramLike, refreshPrograms} = useWorkoutPrograms();
  const {toggleLike} = usePrograms(programs, updateProgramLike);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {contentPaddingBottom} = useTabBarHeight();

  const handleProgramPress = (program: WorkoutProgram) => {
    navigation.navigate('Libre', {programId: program.id});
  };

  const handleProgramLike = (programId: string) => {
    toggleLike(programId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPrograms();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <TrainingScreenSkeleton />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={appColors.primary}
              colors={[appColors.primary]}
            />
          }>
          <AppTitle
            greeting="🎯 Training"
            subGreeting="Découvre les meilleures techniques"
            showIcon={false}
          />
          <EmptyState
            icon="alert-circle-outline"
            title="Erreur de chargement"
            message={error}
            isLoading={false}
          />
        </ScrollView>
      </LinearGradient>
    );
  }

  if (!programs || !programs.length) {
    return (
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={appColors.primary}
              colors={[appColors.primary]}
            />
          }>
          <AppTitle
            greeting="🎯 Training"
            subGreeting="Découvre les meilleures techniques"
            showIcon={false}
          />
          <EmptyState
            icon="barbell-outline"
            title="Bientôt disponible"
            message="Les programmes d'entraînement arrivent bientôt ! Nous travaillons dessus pour vous proposer les meilleurs exercices."
            isLoading={isLoading}
          />
        </ScrollView>
      </LinearGradient>
    );
  }

  // Récupération unique de toutes les difficultés présentes
  const difficulties: DifficultyLevel[] = Array.from(
    new Set(programs.map(p => p.difficulty)),
  );

  return (
    <FadeInView>
      <LinearGradient
        colors={[appColors.background, appColors.backgroundDark]}
        style={styles.gradientContainer}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={appColors.primary}
              colors={[appColors.primary]}
            />
          }>
          <AppTitle
            greeting="🎯 Training"
            subGreeting="Découvre les meilleures techniques"
            showIcon={false}
          />

          <QuoteCard
            style={styles.quote}
            quote="Commence à pousser tes limites et à découvrir tes propres techniques de pompe et de pression."
          />

          {/* Boucle sur les niveaux de difficulté */}
          <ProgramsByDifficulty
            difficulties={difficulties}
            programs={programs}
            onProgramPress={handleProgramPress}
            onProgramLike={handleProgramLike}
            getProgramIcon={getProgramIcon}
          />

          <Footer />

          <View style={{height: contentPaddingBottom}} />
        </ScrollView>
      </LinearGradient>
    </FadeInView>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
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
  quote: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  cards: {
    gap: 16,
  },
  leftCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cardTextContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 25,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  cardSubLabel: {
    fontSize: 13,
    color: appColors.textSecondary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: appColors.error,
  },
  emptyText: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
});

export default TrainingScreen;
