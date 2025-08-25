import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

export default function Inicial() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/img/logoCPS.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Bem-vindo ao APP oficial de simulados do CPS!</Text>
      <Text style={styles.subtitle}>Comece a praticar e evoluir agora mesmo.</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={[styles.buttonText, styles.registerText]}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
