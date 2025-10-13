import LinearGradient from 'react-native-linear-gradient';
import appColors from '../../assets/colors';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const LoaderScreen = () => (
  <LinearGradient
    colors={[appColors.background, appColors.backgroundDark]}
    style={styles.gradient}>
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={appColors.primary} />
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoaderScreen;
