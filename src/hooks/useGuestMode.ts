import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage keys
const GUEST_MODE_KEY = '@guest_mode';
const GUEST_SESSIONS_COUNT_KEY = '@guest_sessions_count';
const FIRST_CHALLENGE_COMPLETED_KEY = '@first_challenge_completed';

export interface GuestModeData {
  isGuestMode: boolean;
  guestSessionsCount: number;
  firstChallengeCompleted: boolean;
}

export const useGuestMode = () => {
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestSessionsCount, setGuestSessionsCount] = useState(0);
  const [firstChallengeCompleted, setFirstChallengeCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au montage
  useEffect(() => {
    loadGuestData();
  }, []);

  const loadGuestData = async () => {
    try {
      const [guestMode, sessionsCount, challengeCompleted] = await Promise.all([
        AsyncStorage.getItem(GUEST_MODE_KEY),
        AsyncStorage.getItem(GUEST_SESSIONS_COUNT_KEY),
        AsyncStorage.getItem(FIRST_CHALLENGE_COMPLETED_KEY),
      ]);

      setIsGuestMode(guestMode === 'true');
      setGuestSessionsCount(sessionsCount ? parseInt(sessionsCount, 10) : 0);
      setFirstChallengeCompleted(challengeCompleted === 'true');
    } catch (error) {
      console.error('Error loading guest data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const enableGuestMode = async () => {
    try {
      await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
      setIsGuestMode(true);
    } catch (error) {
      console.error('Error enabling guest mode:', error);
    }
  };

  const disableGuestMode = async () => {
    try {
      await AsyncStorage.multiRemove([
        GUEST_MODE_KEY,
        GUEST_SESSIONS_COUNT_KEY,
        FIRST_CHALLENGE_COMPLETED_KEY,
      ]);
      setIsGuestMode(false);
      setGuestSessionsCount(0);
      setFirstChallengeCompleted(false);
    } catch (error) {
      console.error('Error disabling guest mode:', error);
    }
  };

  const incrementGuestSessions = async () => {
    try {
      const newCount = guestSessionsCount + 1;
      await AsyncStorage.setItem(
        GUEST_SESSIONS_COUNT_KEY,
        newCount.toString(),
      );
      setGuestSessionsCount(newCount);
      return newCount;
    } catch (error) {
      console.error('Error incrementing guest sessions:', error);
      return guestSessionsCount;
    }
  };

  const markFirstChallengeCompleted = async () => {
    try {
      await AsyncStorage.setItem(FIRST_CHALLENGE_COMPLETED_KEY, 'true');
      setFirstChallengeCompleted(true);
    } catch (error) {
      console.error('Error marking first challenge completed:', error);
    }
  };

  const shouldShowSignupPrompt = () => {
    // Afficher le prompt d'inscription après 2 sessions en mode invité
    return isGuestMode && guestSessionsCount >= 2;
  };

  const canContinueAsGuest = () => {
    // Limite de 3 sessions en mode invité
    return guestSessionsCount < 3;
  };

  return {
    isGuestMode,
    guestSessionsCount,
    firstChallengeCompleted,
    isLoading,
    enableGuestMode,
    disableGuestMode,
    incrementGuestSessions,
    markFirstChallengeCompleted,
    shouldShowSignupPrompt,
    canContinueAsGuest,
  };
};
