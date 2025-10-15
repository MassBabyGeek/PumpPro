import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TabsNavigator from '../../TabsNavigator/TabsNavigator';
import EditProfileScreen from '../../../screens/EditProfileScreen/EditProfileScreen';
import NotificationScreen from '../../../screens/NotificationScreen';
import LeaderboardDetailScreen from '../../../screens/LeaderboardDetailScreen/LeaderboardDetailScreen';

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
    </Stack.Navigator>
  );
};

export default AppStack;
