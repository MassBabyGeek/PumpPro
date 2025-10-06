import {StyleSheet, Text} from 'react-native';
import appColors from '../../assets/colors';

type AppTitleProps = {
  text: string;
  color?: string;
};

const AppTitle = ({text, color = appColors.textPrimary}: AppTitleProps) => {
  return <Text style={{...style.title, color: color}}>{text}</Text>;
};

const style = StyleSheet.create({
  title: {fontSize: 40, fontWeight: 'bold'},
});

export default AppTitle;
