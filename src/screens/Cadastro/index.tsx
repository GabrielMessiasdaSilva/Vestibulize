// cadastro.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showMessage } from "react-native-flash-message";
import { styles } from "./styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const AnimatedInput = ({
  label,
  value,
  onChangeText,
  secureTextEntryProp,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntryProp?: boolean;
  error?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(secureTextEntryProp ?? false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value) {
      Animated.timing(labelAnim, { toValue: 1, duration: 0, useNativeDriver: false }).start();
    }
  }, [value]);

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
    position: "absolute" as "absolute",
    left: 0,
    top: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [18, -6] }),
    fontSize: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
    color: isFocused ? "#004854" : "#3a3030ff",
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
      {secureTextEntryProp !== undefined && (
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={styles.showPasswordButton}
        >
          <Icon
            name={secureTextEntry ? "eye-off" : "eye"}
            size={24}
            color="#004854"
          />
        </TouchableOpacity>
      )}
      <Animated.View style={animatedUnderlineStyle} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default function Cadastro() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const schema = yup.object({
    username: yup.string().required("Nome obrigatório"),
    email: yup.string().email("Email inválido").required("Email obrigatório"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Senha obrigatória"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Senhas não conferem")
      .required("Confirme a senha"),
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      showMessage({
        message: "Erro",
        description: "Preencha todos os campos",
        type: "danger",
        icon: "danger",
        duration: 4000,
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), { username: data.username, email: data.email });

      showMessage({
        message: "Sucesso",
        description: "Conta criada! Verifique seu email.",
        type: "success",
        icon: "success",
        duration: 7000,
      });

      reset();
      navigation.navigate("Login" as never);
    } catch (error: any) {
      let message = "Erro ao criar conta";
      if (error.code === "auth/email-already-in-use") message = "Email já está em uso";
      else if (error.code === "auth/invalid-email") message = "Email inválido";

      showMessage({
        message: "Erro",
        description: message,
        type: "danger",
        icon: "danger",
        duration: 4000,
      });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../../../assets/img/logoCPS.png')} style={styles.logo} />
        <Text style={styles.title}>Faça o seu cadastro para começar a praticar</Text>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => <AnimatedInput label="Nome" value={value} onChangeText={onChange} error={errors.username?.message} />}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => <AnimatedInput label="Email" value={value} onChangeText={onChange} error={errors.email?.message} />}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <AnimatedInput label="Senha" value={value} onChangeText={onChange} secureTextEntryProp={true} error={errors.password?.message} />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <AnimatedInput label="Confirmar senha" value={value} onChangeText={onChange} secureTextEntryProp={true} error={errors.confirmPassword?.message} />
          )}
        />

        <TouchableOpacity style={styles.cadastroButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.cadastroButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
