import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import { splashStyles } from './styles';

type SplashScreenProps = StackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkStatus = async () => {
      // 👉 sem AsyncStorage por enquanto
      // sempre manda pro Onboarding
      navigation.replace('Onboarding');
    };

    checkStatus();
  }, [navigation]);

  return (
    <View style={splashStyles.container}>
      <Image source={require('../../../assets/img/logoCPS.png')} style={splashStyles.logo} />
      <Text style={splashStyles.text}>Vestibulize</Text>
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
    </View>
  );
};

export default SplashScreen;
