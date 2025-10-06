import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChallengeScreen from '../../../screens/ChallengeScreen/ChallengeScreen';
import ChallengeDetailScreen from '../../../screens/ChallengeDetailScreen/ChallengeDetailScreen';

const Stack = createNativeStackNavigator();

const ChallengeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ChallengeList" component={ChallengeScreen} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
    </Stack.Navigator>
  );
};

export default ChallengeStack;
