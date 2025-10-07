//app routes
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OnboardingScreen from '../screens/SplashScreen/OnboardingScreen';
import Inicial from '../screens/Inicial';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Home from '../screens/Home';
import Vida from '../screens/Vida';
import Ranking from '../screens/ExameConquista';
import Conquista from '../screens/Conquista';
import ExameConquista from '../screens/ExameConquista';
import Perfil from '../screens/Perfil';
import Mapa from '../screens/Mapa';
import Materia from '../screens/Materia';
import Desafio from '../screens/Desafio';
import Quiz from '../screens/Quiz';
import Terms from '../screens/Termos';
import Exames from '../screens/Exames';
import DecidirTempo from '../screens/DecidirTempo';
import Fatecs from '../screens/Fatecs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Inicial" component={Inicial} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Vida" component={Vida} />
        <Stack.Screen name="Mapa" component={Mapa} />
        <Stack.Screen name="Ranking" component={Ranking} />
        <Stack.Screen name="Materia" component={Materia} />
        <Stack.Screen name="Conquista" component={Conquista} />
        <Stack.Screen name="ExameConquista" component={ExameConquista} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Desafio" component={Desafio} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Termos" component={Terms} />
        <Stack.Screen name="Exames" component={Exames} />
        <Stack.Screen name="DecidirTempo" component={DecidirTempo} />
        <Stack.Screen name="Fatecs" component={Fatecs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
