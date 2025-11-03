import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Hook pour obtenir la hauteur de la barre d'onglets
 * et le padding bottom nécessaire pour éviter que le contenu soit caché
 */
export const useTabBarHeight = () => {
  const insets = useSafeAreaInsets();

  // Hauteur de la tab bar (sans les insets)
  const baseTabBarHeight = Platform.OS === 'ios' ? 88 : 70;

  // Hauteur totale de la tab bar (avec les insets)
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 70 + insets.bottom;

  // Padding bottom recommandé pour les ScrollView/FlatList
  // Ajoute un petit espace supplémentaire pour le confort
  const contentPaddingBottom = tabBarHeight + 20;

  return {
    tabBarHeight,
    baseTabBarHeight,
    contentPaddingBottom,
    bottomInset: insets.bottom,
  };
};
