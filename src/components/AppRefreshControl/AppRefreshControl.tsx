import React from 'react';
import {RefreshControl, RefreshControlProps} from 'react-native';
import appColors from '../../assets/colors';

type AppRefreshControlProps = Omit<RefreshControlProps, 'tintColor' | 'colors' | 'progressBackgroundColor'>;

const AppRefreshControl = (props: AppRefreshControlProps) => {
  return (
    <RefreshControl
      tintColor={appColors.primary}
      colors={[appColors.primary]}
      progressBackgroundColor={appColors.background}
      {...props}
    />
  );
};

export default AppRefreshControl;
