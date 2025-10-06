import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import appColors from '../../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import TrainingStack from '../Stacks/TrainingStack/TrainingStack';
import ChallengeStack from '../Stacks/ChallengeStack/ChallengeStack';

// Créer les navigators
const Tab = createBottomTabNavigator();

// Tabs Navigator pour gérer les onglets de navigation
const TabsNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
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
            tabBarIcon: ({focused}) => (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={28}
                color={focused ? appColors.primary : appColors.disabled}
              />
            ),
            tabBarLabel: 'Home',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Challenges"
          component={ChallengeStack}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                name={focused ? 'trophy' : 'trophy-outline'}
                size={28}
                color={focused ? appColors.primary : appColors.disabled}
              />
            ),
            tabBarLabel: 'Challenges',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="PushUp"
          component={TrainingStack} // Utilise la stack de PushUp pour le détail
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                name={focused ? 'fitness' : 'fitness-outline'}
                size={28}
                color={focused ? appColors.primary : appColors.disabled}
              />
            ),
            tabBarLabel: 'Push Up',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                name={focused ? 'person' : 'person-outline'}
                size={28}
                color={focused ? appColors.primary : appColors.disabled}
              />
            ),
            tabBarLabel: 'Profil',
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabsNavigator;
