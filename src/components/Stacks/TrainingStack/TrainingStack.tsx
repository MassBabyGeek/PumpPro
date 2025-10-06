import {createStackNavigator} from '@react-navigation/stack';
import PushUpScreen from '../../../screens/PushUpScreen/PushUpScreen';
import TrainingScreen from '../../../screens/TrainingScreen/TrainingScreen';
import appColors from '../../../assets/colors';
import PushUpSummaryScreen from '../../../screens/PushUpSummaryScreen/PushUpSummaryScreen';

const Stack = createStackNavigator();

const TrainingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 80,
        backgroundColor: appColors.background,
      },
    }}>
    <Stack.Screen
      name="Training"
      component={TrainingScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Libre"
      component={PushUpScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="PushUpSummary"
      component={PushUpSummaryScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);
export default TrainingStack;
