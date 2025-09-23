// login.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, KeyboardAvoidingView, ScrollView, Platform, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { styles } from './styles';

type FormData = { email: string; password: string };

// Input animado com linha inferior
const AnimatedInput = ({ label, value, onChangeText, secureTextEntry, error }: { label: string; value: string; onChangeText: (text: string) => void; secureTextEntry?: boolean; error?: string }) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    Animated.timing(underlineAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) Animated.timing(labelAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    Animated.timing(underlineAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const animatedLabelStyle = {
    position: 'absolute' as 'absolute',
    left: 0,
    top: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [18, -6] }),
    fontSize: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
    color: isFocused ? '#004854' : '#999',
    paddingHorizontal: 4,
  };

  const animatedUnderlineStyle = {
    ...styles.underline,
    transform: [{ scaleX: underlineAnim }],
  };

  return (
    <View style={styles.inputContainer}>
      <Animated.Text style={animatedLabelStyle}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        style={styles.textInput}
      />
      <Animated.View style={animatedUnderlineStyle} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default function Login() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);

  useEffect(() => {
    const loadAttempts = async () => {
      const attemptsSaved = await AsyncStorage.getItem("loginAttempts");
      const blockedSaved = await AsyncStorage.getItem("loginBlockedUntil");
      if (attemptsSaved) setAttempts(Number(attemptsSaved));
      if (blockedSaved) setBlockedUntil(Number(blockedSaved));
    };
    loadAttempts();
  }, []);

  const saveAttempts = async (newAttempts: number, blockTime?: number) => {
    await AsyncStorage.setItem("loginAttempts", newAttempts.toString());
    setAttempts(newAttempts);
    if (blockTime) {
      await AsyncStorage.setItem("loginBlockedUntil", blockTime.toString());
      setBlockedUntil(blockTime);
    } else {
      await AsyncStorage.removeItem("loginBlockedUntil");
      setBlockedUntil(null);
    }
  };

  const schema = yup.object({
    email: yup.string().email(t('login.emailInvalido')).required(t('login.emailObrigatorio')),
    password: yup.string().required(t('login.senhaObrigatoria')),
  });

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (blockedUntil && Date.now() < blockedUntil) {
      const minutesLeft = Math.ceil((blockedUntil - Date.now()) / 60000);
      showMessage({ message: "Bloqueado", description: `Tente novamente em ${minutesLeft} min.`, type: "danger", icon: "danger" });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        showMessage({ message: t('login.emailNaoVerificadoTitulo'), description: t('login.emailNaoVerificadoMensagem'), type: "warning", icon: "warning" });
        await sendEmailVerification(user);
        return;
      }

      await saveAttempts(0);
      await AsyncStorage.setItem('userToken', user.uid);
      navigation.navigate('Home' as never);

    } catch (error: any) {
      let message = t('login.erroGenerico');
      if (error.code === 'auth/user-not-found') message = t('login.usuarioNaoEncontrado');
      else if (error.code === 'auth/wrong-password') message = t('login.senhaIncorreta');
      else if (error.code === 'auth/invalid-email') message = t('login.emailInvalido');
      const newAttempts = attempts + 1;
      if (newAttempts >= 7) {
        const blockTime = Date.now() + 15 * 60 * 1000;
        showMessage({ message: "Bloqueado", description: "Muitas tentativas inválidas. Tente novamente mais tarde.", type: "danger", icon: "danger" });
      } else {
        await saveAttempts(newAttempts);
        showMessage({ message: t('login.erro'), description: message, type: "danger", icon: "danger" });
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!emailValue) {
      showMessage({ message: t('login.atencao'), description: t('login.digiteEmailParaRedefinir'), type: "warning", icon: "warning" });
      return;
    }
    await sendPasswordResetEmail(auth, emailValue);
    showMessage({ message: t('success'), description: t('login.emailRedefinicaoEnviado'), type: "success", icon: "success" });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../../../assets/img/logoCPS.png')} style={styles.logo} />
        <Text style={styles.title}>Vamos para o próximo passo rumo à FATEC?</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AnimatedInput
              label="Email"
              value={value}
              onChangeText={(text) => { setEmailValue(text); onChange(text); }}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <AnimatedInput
              label="Senha"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              error={errors.password?.message}
            />
          )}
        />

        <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-start', marginTop: 8 }}>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.buttonPrimary}
          >
            <Text style={styles.buttonTextPrimary}>Entrar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cadastroContainer}>
          <Text style={styles.cadastroText}>
            Não tem uma conta?{' '}
            <Text
              style={styles.cadastroLink}
              onPress={() => navigation.navigate('Cadastro' as never)}
            >
              Faça o cadastro
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
