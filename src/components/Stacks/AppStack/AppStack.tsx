import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TabsNavigator from '../../TabsNavigator/TabsNavigator';

const Stack = createStackNavigator();

type AppStackProps = {
  onLogout?: () => void;
};

const AppStack = ({onLogout}: AppStackProps) => {
  return (
    <Stack.Navigator>
      {/* Ajout des onglets en tant que route principale après connexion */}
      <Stack.Screen
        name="HomeTabs"
        component={TabsNavigator}
        options={{headerShown: false}} // Désactive l'affichage du header pour la tab navigation
      />
    </Stack.Navigator>
  );
};

export default AppStack;
