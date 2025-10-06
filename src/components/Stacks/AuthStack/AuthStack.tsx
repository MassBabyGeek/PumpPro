import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../../../screens/SignUpScreen/SignUpScreen';
import ForgotPasswordScreen from '../../../screens/ForgotPasswordScreen/ForgotPasswordScreen';

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
    </Stack.Navigator>
  );
};

export default AuthStack;
