import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {GradientButton} from '../../components';
import PushUpCamera from '../../components/PushUpCamera/PushUpCamera';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ONBOARDING_KEY = '@pompeurpro:onboarding_completed';

interface OnboardingSlide {
  id: string;
  emoji: string;
  title: string;
  description: string;
  gradient: [string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    emoji: '🎥',
    title: 'Détection Intelligente',
    description:
      'Utilise ta caméra frontale pour compter automatiquement tes pompes. Fini le comptage manuel !',
    gradient: [appColors.primary, appColors.accent],
  },
  {
    id: '2',
    emoji: '💪',
    title: 'Essaie par toi-même !',
    description:
      'Positionne ton visage face à la caméra et fais quelques pompes pour tester la détection.',
    gradient: [appColors.accent, appColors.success],
  },
  {
    id: '3',
    emoji: '📈',
    title: 'Suis ta Progression',
    description:
      'Visualise tes progrès avec des graphiques détaillés et atteins tes objectifs plus rapidement.',
    gradient: [appColors.success, appColors.warning],
  },
  {
    id: '4',
    emoji: '🏆',
    title: 'Défis et Classements',
    description:
      'Participe à des challenges, compare-toi aux autres et grimpe dans le leaderboard !',
    gradient: [appColors.warning, appColors.danger],
  },
  {
    id: '5',
    emoji: '🚀',
    title: 'Prêt à commencer ?',
    description:
      "Rejoins la communauté PompeurPro et transforme ton entraînement dès aujourd'hui !",
    gradient: [appColors.danger, appColors.primary],
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [demoPushUpCount, setDemoPushUpCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      // Navigate to auth with parameter to indicate we just came from onboarding
      // Using navigate instead of reset to preserve navigation history
      navigation.navigate('Auth', {
        screen: 'SignUp',
        params: {fromOnboarding: true},
      });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      // Navigate to auth with parameter to indicate we just came from onboarding
      // Using navigate instead of reset to preserve navigation history
      navigation.navigate('Auth', {
        screen: 'Login',
        params: {fromOnboarding: true},
      });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({item}: {item: OnboardingSlide}) => {
    const isDemoSlide = item.id === '2';

    return (
      <LinearGradient
        colors={item.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.slide}>
        <View style={styles.slideContent}>
          {isDemoSlide ? (
            <>
              {/* Compteur de démonstration */}
              <View style={styles.demoCounterContainer}>
                <Text style={styles.demoCounterLabel}>Pompes détectées</Text>
                <Text style={styles.demoCounter}>{demoPushUpCount}</Text>
                <Text style={styles.demoHint}>
                  {demoPushUpCount === 0
                    ? 'Place ton visage face à la caméra'
                    : 'Excellent ! Continue comme ça 💪'}
                </Text>
              </View>
              <Text style={styles.demoTitle}>{item.title}</Text>
              <Text style={styles.demoDescription}>{item.description}</Text>
              {/* Caméra cachée pour la détection */}
              <PushUpCamera
                setPushUpCount={setDemoPushUpCount}
                isActive={currentIndex === 1}
              />
            </>
          ) : (
            <>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </>
          )}
        </View>
      </LinearGradient>
    );
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => {
        const inputRange = [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              {
                width: dotWidth,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      <View
        style={[
          styles.footer,
          {
            paddingBottom:
              Platform.OS === 'ios' ? 40 : Math.max(insets.bottom + 20, 40),
          },
        ]}>
        {renderPagination()}

        <View style={styles.buttonContainer}>
          <GradientButton
            text={
              currentIndex === slides.length - 1 ? "C'est parti !" : 'Suivant'
            }
            onPress={handleNext}
            icon={
              currentIndex === slides.length - 1 ? undefined : 'arrow-forward'
            }
          />

          {currentIndex < slides.length - 1 ? (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Passer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginText}>J'ai déjà un compte</Text>
              <Icon name="log-in-outline" size={18} color={appColors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 400,
    paddingHorizontal: 40,
  },
  emojiContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: appColors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    height: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.primary,
    marginHorizontal: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  nextButton: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  loginButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    borderRadius: 12,
  },
  loginText: {
    fontSize: 16,
    color: appColors.primary,
    fontWeight: '600',
  },
  // Styles pour la slide de démonstration
  demoCounterContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  demoCounterLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 8,
  },
  demoCounter: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 8,
  },
  demoHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  demoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  demoDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default OnboardingScreen;
export {ONBOARDING_KEY};
