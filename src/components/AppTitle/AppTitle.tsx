import appColors from '../../assets/colors';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AppTitleProps {
  greeting?: string;
  subGreeting?: string;
  iconName?: string;
  onIconPress?: () => void;
  showIcon?: boolean;
  containerStyle?: ViewStyle;
  greetingStyle?: TextStyle;
  subGreetingStyle?: TextStyle;
}

const AppTitle: React.FC<AppTitleProps> = ({
  greeting = 'Salut Champion! 👋',
  subGreeting = 'Prêt à repousser tes limites?',
  iconName = 'notifications-outline',
  onIconPress,
  showIcon = true,
  containerStyle,
  greetingStyle,
  subGreetingStyle,
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <View>
        <Text style={[styles.greeting, greetingStyle]}>{greeting}</Text>
        <Text style={[styles.subGreeting, subGreetingStyle]}>
          {subGreeting}
        </Text>
      </View>

      {showIcon && (
        <TouchableOpacity
          onPress={onIconPress}
          style={styles.notificationButton}
          activeOpacity={onIconPress ? 0.7 : 1}>
          <Icon name={iconName} size={24} color={appColors.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  subGreeting: {
    fontSize: 15,
    color: appColors.textSecondary,
  },
  notificationButton: {
    backgroundColor: appColors.background,
    padding: 10,
    borderRadius: 15,
  },
});

export default AppTitle;
