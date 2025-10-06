import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../../../screens/SignUpScreen/SignUpScreen';
import ForgotPasswordScreen from '../../../screens/ForgotPasswordScreen/ForgotPasswordScreen';

const Stack = createStackNavigator();

type AuthStackProps = {
  onLogin: () => void;
};

const AuthStack = ({onLogin}: AuthStackProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {props => <SignUpScreen {...props} onSignUp={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
