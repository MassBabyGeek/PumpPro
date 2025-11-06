import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {AuthProvider} from './src/contexts/AuthContext';
import {OfflineProvider} from './src/contexts/OfflineContext';
import {CalibrationProvider} from './src/contexts/CalibrationContext';
import {useAuth} from './src/hooks/useAuth';
import AuthStack from './src/components/Stacks/AuthStack/AuthStack';
import AppStack from './src/components/Stacks/AppStack/AppStack';
import OfflineBanner from './src/components/OfflineBanner';
import {toastConfig} from './src/components/CustomToast/CustomToast';
import ErrorBoundary from './src/components/ErrorBoundary';
import {disableDevMenu} from './src/utils/disableDevMenu';
import OnboardingScreen, {
  ONBOARDING_KEY,
} from './src/screens/OnboardingScreen/OnboardingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen/WelcomeScreen';
import FirstChallengeScreen from './src/screens/FirstChallengeScreen/FirstChallengeScreen';
import ChallengeResultsScreen from './src/screens/ChallengeResultsScreen/ChallengeResultsScreen';

const RootStack = createStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, isLoading: authLoading} = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

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
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  // Attendre que tout soit chargé avant d'afficher la navigation
  if (authLoading || isCheckingOnboarding) {
    return null; // Ou un splash screen si tu en as un
  }

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
              <RootStack.Screen
                name="FirstChallenge"
                component={FirstChallengeScreen}
              />
              <RootStack.Screen
                name="ChallengeResults"
                component={ChallengeResultsScreen}
              />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default function App() {
  useEffect(() => {
    // Désactiver le dev menu shake pour éviter les ouvertures accidentelles pendant l'exercice
    disableDevMenu();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <CalibrationProvider>
            <OfflineProvider>
              <AppNavigator />
              <Toast config={toastConfig} />
            </OfflineProvider>
          </CalibrationProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
