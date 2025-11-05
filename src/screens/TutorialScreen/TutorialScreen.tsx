import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../assets/colors';
import {GradientButton} from '../../components';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface TutorialSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

const tutorialSlides: TutorialSlide[] = [
  {
    id: '1',
    title: 'Place ton téléphone au sol',
    description:
      'Pose ton téléphone devant toi, à environ 30-50 cm. La caméra frontale doit être face à ton visage.',
    icon: 'phone-portrait-outline',
    iconColor: appColors.primary,
  },
  {
    id: '2',
    title: 'Position de pompe',
    description:
      'Mets-toi en position de pompe. La caméra va détecter ton visage pour compter automatiquement.',
    icon: 'fitness-outline',
    iconColor: appColors.accent,
  },
  {
    id: '3',
    title: 'Lance le défi !',
    description:
      'Commence tes pompes ! Descends et remonte complètement. Chaque répétition sera comptée automatiquement.',
    icon: 'rocket-outline',
    iconColor: appColors.success,
  },
];

const TutorialScreen = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < tutorialSlides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    } else {
      // Dernier slide, aller au challenge
      navigation.navigate('FirstChallenge');
    }
  };

  const handleSkip = () => {
    navigation.navigate('FirstChallenge');
  };

  const renderSlide = ({item}: {item: TutorialSlide}) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            {backgroundColor: `${item.iconColor}20`},
          ]}>
          <Icon name={item.icon} size={80} color={item.iconColor} />
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {tutorialSlides.map((_, index) => {
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
            style={[styles.dot, {width: dotWidth, opacity}]}
          />
        );
      })}
    </View>
  );

  return (
    <LinearGradient
      colors={[appColors.background, appColors.backgroundDark]}
      style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Tutorial slides */}
      <FlatList
        ref={flatListRef}
        data={tutorialSlides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          setCurrentIndex(index);
        }}
      />

      {/* Pagination dots */}
      {renderPagination()}

      {/* Next/Start button */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title={
            currentIndex === tutorialSlides.length - 1
              ? "C'est parti ! 🔥"
              : 'Suivant'
          }
          onPress={handleNext}
          paddingHorizontal={60}
          paddingVertical={18}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipText: {
    color: appColors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  iconContainer: {
    marginBottom: 60,
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.primary,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
});

export default TutorialScreen;
