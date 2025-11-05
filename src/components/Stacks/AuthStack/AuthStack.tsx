import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../../../screens/SignUpScreen/SignUpScreen';
import ForgotPasswordScreen from '../../../screens/ForgotPasswordScreen/ForgotPasswordScreen';
import TutorialScreen from '../../../screens/TutorialScreen/TutorialScreen';
import FirstChallengeScreen from '../../../screens/FirstChallengeScreen/FirstChallengeScreen';
import ChallengeResultsScreen from '../../../screens/ChallengeResultsScreen/ChallengeResultsScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Tutorial" component={TutorialScreen} />
      <Stack.Screen name="FirstChallenge" component={FirstChallengeScreen} />
      <Stack.Screen name="ChallengeResults" component={ChallengeResultsScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
