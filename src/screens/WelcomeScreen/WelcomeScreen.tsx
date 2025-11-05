import React, {JSX, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import appColors from '../../assets/colors';
import {GradientButton, AppButton} from '../../components';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const PREVIEW_WIDTH = SCREEN_WIDTH * 0.85;

interface FeaturePreview {
  id: string;
  title: string;
  emoji: string;
  renderContent: () => JSX.Element;
}

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleTryNow = () => {
    // Mode invité - va directement vers le premier défi avec calibration
    navigation.navigate('FirstChallenge');
  };

  const handleLogin = () => {
    navigation.navigate('Auth', {screen: 'Login'});
  };

  // Mock data pour les previews
  const mockLeaderboard = [
    {rank: 1, name: 'Alex M.', score: 2500, emoji: '🥇'},
    {rank: 2, name: 'Sarah L.', score: 2350, emoji: '🥈'},
    {rank: 3, name: 'Toi', score: 2100, emoji: '🥉', isUser: true},
    {rank: 4, name: 'Mike R.', score: 1890, emoji: '💪'},
  ];

  const mockStats = {
    today: 45,
    week: 312,
    total: 5420,
    streak: 7,
  };

  const features: FeaturePreview[] = [
    {
      id: '1',
      title: 'Mini Session',
      emoji: '🎯',
      renderContent: () => (
        <View style={styles.previewCard}>
          <View style={styles.sessionPreview}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>Session en cours</Text>
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>02:34</Text>
              </View>
            </View>
            <View style={styles.bigCounterContainer}>
              <Text style={styles.bigCounterLabel}>Pompes</Text>
              <Text style={styles.bigCounter}>45</Text>
              <Text style={styles.bigCounterSubtext}>Continue ! 🔥</Text>
            </View>
            <View style={styles.sessionStats}>
              <View style={styles.statMini}>
                <Text style={styles.statMiniValue}>18</Text>
                <Text style={styles.statMiniLabel}>par min</Text>
              </View>
              <View style={styles.statMini}>
                <Text style={styles.statMiniValue}>85%</Text>
                <Text style={styles.statMiniLabel}>précision</Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: '2',
      title: 'Classement',
      emoji: '🏆',
      renderContent: () => (
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Leaderboard</Text>
          <View style={styles.leaderboardPreview}>
            {mockLeaderboard.map(player => (
              <View
                key={player.rank}
                style={[
                  styles.leaderboardItem,
                  player.isUser && styles.leaderboardItemHighlight,
                ]}>
                <View style={styles.leaderboardLeft}>
                  <Text style={styles.leaderboardEmoji}>{player.emoji}</Text>
                  <Text
                    style={[
                      styles.leaderboardName,
                      player.isUser && styles.leaderboardNameHighlight,
                    ]}>
                    {player.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.leaderboardScore,
                    player.isUser && styles.leaderboardScoreHighlight,
                  ]}>
                  {player.score.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      id: '3',
      title: 'Statistiques',
      emoji: '📊',
      renderContent: () => (
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Tes Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.today}</Text>
              <Text style={styles.statLabel}>Aujourd'hui</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.week}</Text>
              <Text style={styles.statLabel}>Cette semaine</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.streak} 🔥</Text>
              <Text style={styles.statLabel}>Jours consécutifs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {mockStats.total.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
          {/* Mini graphique */}
          <View style={styles.miniGraph}>
            <View style={styles.graphBars}>
              {[65, 45, 80, 55, 90, 75, 100].map((height, i) => (
                <View key={i} style={styles.graphBarContainer}>
                  <View
                    style={[
                      styles.graphBar,
                      {height: `${height}%`},
                      i === 6 && styles.graphBarActive,
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.graphLabels}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <Text
                  key={i}
                  style={[
                    styles.graphLabel,
                    i === 6 && styles.graphLabelActive,
                  ]}>
                  {day}
                </Text>
              ))}
            </View>
          </View>
        </View>
      ),
    },
  ];

  const renderFeaturePreview = ({item}: {item: FeaturePreview}) => (
    <View style={styles.previewContainer}>
      <View style={styles.previewHeader}>
        <Text style={styles.previewEmoji}>{item.emoji}</Text>
        <Text style={styles.previewHeaderTitle}>{item.title}</Text>
      </View>
      {item.renderContent()}
    </View>
  );

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <LinearGradient
      colors={[appColors.primary, appColors.accent]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Platform.OS === 'ios' ? 40 : Math.max(insets.bottom + 40, 60),
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Logo et titre */}
          <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>
          <Text style={styles.appName}>PompeurPro</Text>
          <Text style={styles.tagline}>
            Transforme ton corps, une pompe à la fois
          </Text>
        </View>

        {/* Carousel de previews */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={features}
            renderItem={renderFeaturePreview}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            snapToInterval={PREVIEW_WIDTH + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false},
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={16}
          />
          {/* Pagination dots */}
          <View style={styles.paginationDots}>
            {features.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.buttonContainer}>
          <GradientButton
            text="Tester maintenant 🚀"
            onPress={handleTryNow}
          />

          <AppButton
            text="J'ai déjà un compte"
            onPress={handleLogin}
            outlined={true}
          />
        </View>

        {/* Footer info */}
        <Text style={styles.footerText}>
          En continuant, tu acceptes nos conditions d'utilisation
        </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 50,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Carousel styles
  carouselContainer: {
    marginVertical: 20,
  },
  carouselContent: {
    paddingHorizontal: (SCREEN_WIDTH - PREVIEW_WIDTH) / 2,
  },
  previewContainer: {
    width: PREVIEW_WIDTH,
    marginHorizontal: 10,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  previewEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  previewHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 280,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  // Mini session preview
  sessionPreview: {
    gap: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  timerBadge: {
    backgroundColor: appColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bigCounterContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(96, 51, 198, 0.08)',
    borderRadius: 16,
  },
  bigCounterLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  bigCounter: {
    fontSize: 56,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  bigCounterSubtext: {
    fontSize: 14,
    color: appColors.accent,
    fontWeight: '600',
    marginTop: 4,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statMini: {
    flex: 1,
    backgroundColor: 'rgba(96, 51, 198, 0.08)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statMiniValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.primary,
    marginBottom: 4,
  },
  statMiniLabel: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  // Leaderboard preview
  leaderboardPreview: {
    gap: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(96, 51, 198, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  leaderboardItemHighlight: {
    backgroundColor: 'rgba(96, 51, 198, 0.15)',
    borderWidth: 2,
    borderColor: appColors.primary,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leaderboardEmoji: {
    fontSize: 24,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  leaderboardNameHighlight: {
    color: appColors.primary,
    fontWeight: 'bold',
  },
  leaderboardScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.textSecondary,
  },
  leaderboardScoreHighlight: {
    color: appColors.primary,
    fontSize: 18,
  },
  // Stats preview
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(96, 51, 198, 0.08)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  miniGraph: {
    marginTop: 8,
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    gap: 4,
  },
  graphBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  graphBar: {
    backgroundColor: 'rgba(96, 51, 198, 0.3)',
    borderRadius: 4,
    width: '100%',
  },
  graphBarActive: {
    backgroundColor: appColors.primary,
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  graphLabel: {
    flex: 1,
    fontSize: 10,
    color: appColors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  graphLabelActive: {
    color: appColors.primary,
    fontWeight: 'bold',
  },
  // Pagination
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  buttonContainer: {
    gap: 16,
    marginTop: 20,
    paddingHorizontal: 30,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
});

export default WelcomeScreen;
