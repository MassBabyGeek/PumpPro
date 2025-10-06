import {StyleSheet, Text, View} from 'react-native';
import AppTitle from '../../components/AppTitle/AppTitle';
import Card from '../../components/Card/Card';
import appColors from '../../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {WORKOUT_MODES} from '../../constants/workout.constants';
import {TrainingScreenNavigationProp} from '../../types/navigation.types';
import {useNavigation} from '@react-navigation/native';

const TrainingScreen = () => {
  const navigation = useNavigation<TrainingScreenNavigationProp>();

  const handlePress = (route: string) => {
    navigation.navigate(route as any);
  };

  return (
    <View>
      <AppTitle text="Training" />
      <View style={styles.cards}>
        {WORKOUT_MODES.map((mode, index) => (
          <Card
            key={index}
            style={styles.card}
            color={mode.color}
            paddingHorizontal={20}
            paddingVertical={30}
            disabled={mode.disabled}
            onPress={() => handlePress(mode.route)}>
            <View style={styles.leftCard}>
              <Icon name={mode.icon} size={28} color={appColors.primary} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>{mode.label}</Text>
                <Text style={styles.cardSubLabel}>{mode.subLabel}</Text>
              </View>
            </View>

            <Icon
              name="caret-forward-outline"
              size={28}
              color={appColors.primary}
            />
          </Card>
        ))}
      </View>
      <Text style={styles.soon}>D'autres modes à venir...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cards: {
    marginTop: 30,
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
    fontSize: 20,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  cardSubLabel: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  soon: {
    marginTop: 30,
    textAlign: 'center',
    color: appColors.textSecondary,
    fontStyle: 'italic',
  },
});

export default TrainingScreen;
