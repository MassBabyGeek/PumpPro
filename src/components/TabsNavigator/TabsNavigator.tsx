import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import TrainingStack from '../Stacks/TrainingStack/TrainingStack';
import ChallengeStack from '../Stacks/ChallengeStack/ChallengeStack';
import appColors from '../../assets/colors';

// Création du Navigator
const Tab = createBottomTabNavigator();

// Fonction pour générer les icônes d’onglets
const renderTabIcon =
  (iconName: string) =>
  ({focused}: {focused: boolean}) => (
    <Icon
      name={focused ? iconName : `${iconName}-outline`}
      size={28}
      color={focused ? appColors.primary : appColors.disabled}
    />
  );

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.disabled,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 70,
          backgroundColor: appColors.tab,
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: renderTabIcon('home'),
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengeStack}
        options={{
          tabBarLabel: 'Challenges',
          tabBarIcon: renderTabIcon('trophy'),
        }}
      />
      <Tab.Screen
        name="PushUp"
        component={TrainingStack}
        options={{
          tabBarLabel: 'Push Up',
          tabBarIcon: renderTabIcon('fitness'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: renderTabIcon('person'),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
