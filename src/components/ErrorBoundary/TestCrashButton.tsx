import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import appColors from '../../assets/colors';

/**
 * Composant de test pour simuler un crash de l'application
 * À UTILISER UNIQUEMENT EN DÉVELOPPEMENT pour tester l'ErrorBoundary
 *
 * Usage:
 * import TestCrashButton from './components/ErrorBoundary/TestCrashButton';
 * <TestCrashButton />
 */
const TestCrashButton: React.FC = () => {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (!__DEV__) {
    // Ne pas afficher en production
    return null;
  }

  if (shouldCrash) {
    // Déclencher une erreur pour tester l'ErrorBoundary
    throw new Error('Test crash - ErrorBoundary test');
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => setShouldCrash(true)}>
      <Text style={styles.buttonText}>🧪 Test Crash (DEV)</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: appColors.error,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    zIndex: 9999,
    opacity: 0.7,
  },
  buttonText: {
    color: appColors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TestCrashButton;
