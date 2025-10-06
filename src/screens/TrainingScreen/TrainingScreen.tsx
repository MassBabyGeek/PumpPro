import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AppTitle from '../../components/AppTitle/AppTitle';
import Card from '../../components/Card/Card';
import appColors from '../../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {TrainingScreenNavigationProp} from '../../types/navigation.types';
import {useNavigation} from '@react-navigation/native';
import {
  WorkoutProgram,
  TYPE_LABELS,
  DIFFICULTY_LABELS,
  DifficultyLevel,
} from '../../types/workout.types';
import {FREE_MODE_STANDARD} from '../../data/workoutPrograms.mock';
import {useWorkoutPrograms} from '../../hooks/useWorkoutPrograms';
import QuoteCard from '../../components/QuoteCard/QuoteCard';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import LinearGradient from 'react-native-linear-gradient';

const TrainingScreen = () => {
  const navigation = useNavigation<TrainingScreenNavigationProp>();
  const {programs, isLoading, error} = useWorkoutPrograms();

  const handleProgramPress = (program: WorkoutProgram) => {
    navigation.navigate('Libre', {program});
  };

  const getProgramIcon = (type: string) => {
    switch (type) {
      case 'FREE_MODE':
        return 'infinite';
      case 'TARGET_REPS':
        return 'flag';
      case 'MAX_TIME':
        return 'timer';
      case 'SETS_REPS':
        return 'layers';
      case 'PYRAMID':
        return 'triangle';
      case 'EMOM':
        return 'alarm';
      case 'AMRAP':
        return 'fitness';
      default:
        return 'help-circle';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!programs.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucun programme disponible</Text>
      </View>
    );
  }

  // Récupération unique de toutes les difficultés présentes
  const difficulties: DifficultyLevel[] = Array.from(
    new Set(programs.map(p => p.difficulty)),
  );

  return (
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

        {/* Mode libre rapide */}
        <View style={styles.section}>
          <SectionTitle title="⚡ Mode Rapide" />
          <Card
            style={styles.card}
            color={appColors.primary}
            paddingHorizontal={20}
            paddingVertical={30}
            onPress={() => handleProgramPress(FREE_MODE_STANDARD)}>
            <View style={styles.leftCard}>
              <Icon name="flash" size={28} color={appColors.primary} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>Mode Libre</Text>
                <Text style={styles.cardSubLabel}>Commence directement</Text>
              </View>
            </View>
            <Icon
              name="caret-forward-outline"
              size={28}
              color={appColors.primary}
            />
          </Card>
        </View>

        {/* Boucle sur les niveaux de difficulté */}
        {difficulties.map(level => {
          const filteredPrograms = programs.filter(p => p.difficulty === level);

          if (!filteredPrograms.length) return null;

          return (
            <View style={styles.section} key={level}>
              <SectionTitle title={DIFFICULTY_LABELS[level]} />

              <View style={styles.cards}>
                {filteredPrograms.map(program => (
                  <Card
                    key={program.id}
                    style={styles.card}
                    color={appColors.primary}
                    paddingHorizontal={20}
                    paddingVertical={25}
                    onPress={() => handleProgramPress(program)}>
                    <View style={styles.leftCard}>
                      <Icon
                        name={getProgramIcon(program.type)}
                        size={24}
                        color={appColors.primary}
                      />
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardLabel}>{program.name}</Text>
                        <Text style={styles.cardSubLabel}>
                          {TYPE_LABELS[program.type]}
                          {program.type === 'SETS_REPS' &&
                            ` • ${program.sets}x${program.repsPerSet}`}
                          {program.type === 'TARGET_REPS' &&
                            ` • ${program.targetReps} reps`}
                          {program.type === 'MAX_TIME' &&
                            ` • ${Math.round(program.duration / 60)} min`}
                        </Text>
                      </View>
                    </View>
                    <Icon
                      name="caret-forward-outline"
                      size={24}
                      color={appColors.primary}
                    />
                  </Card>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
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
    height: 100,
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
