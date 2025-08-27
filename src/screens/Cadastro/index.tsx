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
  StyleSheet,
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

const { width, height } = Dimensions.get("window");

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Partículas suaves
const Particle = ({ size, x, delay }: { size: number; x: number; delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 15000 + Math.random() * 5000, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 15000 + Math.random() * 5000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [height, -50] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#b9b9b9ff",
        left: x,
        transform: [{ translateY }],
        opacity: 0.1,
      }}
    />
  );
};

// Gradiente animado
const AnimatedGradient = () => {
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, { toValue: 1, duration: 10000, useNativeDriver: false }),
        Animated.timing(gradientAnim, { toValue: 0, duration: 10000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const backgroundColor = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffffff", "#ffffffff"],
  });

  return <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor }]} />;
};

// Input animado com ícone de olho
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = yup.object({
    username: yup.string().required(t("Cadastro.usernameRequired")),
    email: yup.string().email(t("Cadastro.invalidEmail")).required(t("Cadastro.emailRequired")),
    password: yup.string().min(6, t("Cadastro.min6chars")).required(t("Cadastro.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("Cadastro.passwordsDontMatch"))
      .required(t("Cadastro.confirmPasswordRequired")),
  });

  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Bloqueio de campos vazios
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      showMessage({
        message: t("Cadastro.error"),
        description: t("Cadastro.fillAllFields") || "Preencha todos os campos",
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
        message: t("Cadastro.success"),
        description: t("Cadastro.accountCreatedCheckEmail"),
        type: "success",
        icon: "success",
        duration: 7000,
      });

      reset();
      navigation.navigate("Login" as never);
    } catch (error: any) {
      let message = t("Cadastro.accountAlreadyInUse");
      if (error.code === "auth/email-already-in-use") message = t("Cadastro.accountAlreadyInUse");
      else if (error.code === "auth/invalid-email") message = t("Cadastro.invalidEmail");

      showMessage({
        message: t("Cadastro.error"),
        description: message,
        type: "danger",
        icon: "danger",
        duration: 4000,
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Fundo profissional */}
      <AnimatedGradient />
      {Array.from({ length: 15 }).map((_, i) => (
        <Particle key={i} size={10 + Math.random() * 20} x={Math.random() * width} delay={Math.random() * 5000} />
      ))}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/img/logoCPS.png")} style={styles.logo} />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Faça seu cadastro para começar a praticar.</Text>
        </View>

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
            <AnimatedInput label="Senha" value={value} onChangeText={onChange} secureTextEntryProp={!showPassword} error={errors.password?.message} />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <AnimatedInput label="Confirmar senha" value={value} onChangeText={onChange} secureTextEntryProp={!showConfirm} error={errors.confirmPassword?.message} />
          )}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Login" as never)} style={styles.buttonPrimary}>
            <Text style={styles.buttonTextPrimary}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.buttonSecondary}
            disabled={Object.keys(errors).length > 0} // Bloqueia se houver erros
          >
            <Text style={styles.buttonTextSecondary}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
