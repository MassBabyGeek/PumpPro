import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {AuthProvider} from './src/contexts/AuthContext';
import {OfflineProvider} from './src/contexts/OfflineContext';
import {useAuth} from './src/hooks/useAuth';
import AuthStack from './src/components/Stacks/AuthStack/AuthStack';
import AppStack from './src/components/Stacks/AppStack/AppStack';
import OfflineBanner from './src/components/OfflineBanner';
import {toastConfig} from './src/components/CustomToast/CustomToast';
import ErrorBoundary from './src/components/ErrorBoundary';
import OnboardingScreen, {
  ONBOARDING_KEY,
} from './src/screens/OnboardingScreen/OnboardingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen/WelcomeScreen';

const RootStack = createStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated} = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    }
  };

  return (
    <>
      <OfflineBanner />
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {isAuthenticated ? (
            <RootStack.Screen name="App" component={AppStack} />
          ) : hasSeenOnboarding ? (
            <RootStack.Screen name="Auth" component={AuthStack} />
          ) : (
            <>
              <RootStack.Screen name="Welcome" component={WelcomeScreen} />
              <RootStack.Screen
                name="Onboarding"
                component={OnboardingScreen}
              />
              <RootStack.Screen name="Auth" component={AuthStack} />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OfflineProvider>
          <AppNavigator />
          <Toast config={toastConfig} />
        </OfflineProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
