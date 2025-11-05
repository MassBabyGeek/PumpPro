import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TabsNavigator from '../../TabsNavigator/TabsNavigator';
import EditProfileScreen from '../../../screens/EditProfileScreen/EditProfileScreen';
import NotificationScreen from '../../../screens/NotificationScreen';
import LeaderboardDetailScreen from '../../../screens/LeaderboardDetailScreen/LeaderboardDetailScreen';
import WorkoutSessionsScreen from '../../../screens/WorkoutSessionsScreen/WorkoutSessionsScreen';
import UserProfileScreen from '../../../screens/UserProfileScreen/UserProfileScreen';
import UserWorkoutSessionsScreen from '../../../screens/UserWorkoutSessionsScreen/UserWorkoutSessionsScreen';
import FirstChallengeScreen from '../../../screens/FirstChallengeScreen/FirstChallengeScreen';
import ChallengeResultsScreen from '../../../screens/ChallengeResultsScreen/ChallengeResultsScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={TabsNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LeaderboardDetail"
        component={LeaderboardDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WorkoutSessions"
        component={WorkoutSessionsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserWorkoutSessions"
        component={UserWorkoutSessionsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FirstChallenge"
        component={FirstChallengeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChallengeResults"
        component={ChallengeResultsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
