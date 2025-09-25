import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import { splashStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenProps = StackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Verifica se existe token do usuário
        const userToken = await AsyncStorage.getItem('userToken');
        // Verifica se usuário completou o onboarding
        const onboardingDone = await AsyncStorage.getItem('onboardingDone');

        if (userToken) {
          // Usuário logado → Home
          navigation.replace('Home');
        } else if (onboardingDone === 'true') {
          // Onboarding já feito → Login
          navigation.replace('Login');
        } else {
          // Novo usuário → Onboarding
          navigation.replace('Onboarding');
        }
      } catch (error) {
        // Em caso de erro, manda pro Onboarding
        navigation.replace('Onboarding');
      }
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
