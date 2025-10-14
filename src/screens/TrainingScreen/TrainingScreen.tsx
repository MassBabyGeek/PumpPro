import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AppTitle from '../../components/AppTitle/AppTitle';
import appColors from '../../assets/colors';
import {TrainingScreenNavigationProp} from '../../types/navigation.types';
import {useNavigation} from '@react-navigation/native';
import {WorkoutProgram, DifficultyLevel} from '../../types/workout.types';
import QuoteCard from '../../components/QuoteCard/QuoteCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import LinearGradient from 'react-native-linear-gradient';
import ProgramsByDifficulty from './component/ProgramsByDifficulty';
import {useWorkoutPrograms} from '../../hooks';
import LoaderScreen from '../LoaderScreen/LoaderScreen';
import FadeInView from '../../components/FadeInView/FadeInView';
import Footer from '../../components/Footer';

const TrainingScreen = () => {
  const navigation = useNavigation<TrainingScreenNavigationProp>();
  const {programs, isLoading, error, getProgramIcon} = useWorkoutPrograms();

  const handleProgramPress = (program: WorkoutProgram) => {
    navigation.navigate('Libre', {programId: program.id});
  };

  if (isLoading) {
    return <LoaderScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
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
          showsVerticalScrollIndicator={false}>
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
          keyboardShouldPersistTaps="handled">
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
            getProgramIcon={getProgramIcon}
          />

          <Footer />

          <View style={styles.bottomSpacing} />
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
  bottomSpacing: {
    height: 60,
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
