import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import appColors from '../../../assets/colors';

type Props = {navigation: any; title: string};

const LeaderboardHeader = ({navigation, title}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{padding: 4}}>
        <Icon name="arrow-back" size={24} color={appColors.textPrimary} />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: appColors.textPrimary,
        }}>
        {title}
      </Text>
      <View style={{width: 32}} />
    </View>
  );
};

export default LeaderboardHeader;
