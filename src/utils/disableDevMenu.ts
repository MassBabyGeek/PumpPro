import {DevSettings, Platform} from 'react-native';

/**
 * Désactive le dev menu pour éviter les ouvertures accidentelles
 * pendant les exercices de pompes
 */
export const disableDevMenu = () => {
  if (__DEV__) {
    try {
      // Sur iOS, on peut désactiver le shake gesture
      if (Platform.OS === 'ios') {
        // @ts-ignore - méthode non documentée mais fonctionnelle
        if (DevSettings && DevSettings.setIsShakeToShowDevMenuEnabled) {
          DevSettings.setIsShakeToShowDevMenuEnabled(false);
        }
      }

      console.log('[DevMenu] Shake gesture disabled to prevent accidental opening during workouts');
    } catch (error) {
      console.warn('[DevMenu] Could not disable shake gesture:', error);
    }
  }
};

/**
 * Réactive le dev menu (utile pour le développement)
 */
export const enableDevMenu = () => {
  if (__DEV__) {
    try {
      if (Platform.OS === 'ios') {
        // @ts-ignore
        if (DevSettings && DevSettings.setIsShakeToShowDevMenuEnabled) {
          DevSettings.setIsShakeToShowDevMenuEnabled(true);
        }
      }

      console.log('[DevMenu] Shake gesture re-enabled');
    } catch (error) {
      console.warn('[DevMenu] Could not enable shake gesture:', error);
    }
  }
};
