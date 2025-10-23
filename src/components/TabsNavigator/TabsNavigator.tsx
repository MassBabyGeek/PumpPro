import React, {useEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, Platform, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import TrainingStack from '../Stacks/TrainingStack/TrainingStack';
import ChallengeStack from '../Stacks/ChallengeStack/ChallengeStack';
import appColors from '../../assets/colors';

// Création du Navigator
const Tab = createBottomTabNavigator();

// Composant pour une icône de tab avec animation
const TabIcon = ({
  iconName,
  focused,
}: {
  iconName: string;
  focused: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation du badge
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Animation de l'icône (petit bounce)
    if (focused) {
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [focused, scaleAnim, iconScale]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            transform: [{scale: scaleAnim}],
            opacity: scaleAnim,
          },
        ]}
      />
      <Animated.View style={{transform: [{scale: iconScale}]}}>
        <Icon
          name={focused ? iconName : `${iconName}-outline`}
          size={26}
          color={focused ? appColors.primary : appColors.textSecondary}
          style={styles.icon}
        />
      </Animated.View>
    </View>
  );
};

// Fonction pour générer les icônes d'onglets avec un indicateur élégant
const renderTabIcon =
  (iconName: string) =>
  ({focused}: {focused: boolean}) => (
    <TabIcon iconName={iconName} focused={focused} />
  );

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -4,
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 88 : 70,
          backgroundColor: appColors.backgroundDark,
          borderTopWidth: 1,
          borderTopColor: `${appColors.border}30`,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: renderTabIcon('home'),
          popToTopOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengeStack}
        options={{
          tabBarLabel: 'Challenges',
          tabBarIcon: renderTabIcon('trophy'),
          popToTopOnBlur: true,
        }}
      />
      <Tab.Screen
        name="PushUp"
        component={TrainingStack}
        options={{
          tabBarLabel: 'Push Up',
          tabBarIcon: renderTabIcon('fitness'),
          popToTopOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: renderTabIcon('person'),
          popToTopOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 36,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    width: 60,
    height: 36,
    backgroundColor: `${appColors.primary}15`,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: `${appColors.primary}20`,
  },
  icon: {
    zIndex: 1,
  },
});

export default TabsNavigator;
