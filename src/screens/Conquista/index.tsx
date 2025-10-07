import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import Footer from "../../components/Footer";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { EventArg, RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../services/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { styles } from "./styles";


export default function ResultadoQuiz() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Conquista">>();
  const acertos = route.params?.acertos ?? 0;
  const total = 10;
  const porcentagem = acertos / total;

  async function salvarResultadoNoFirebase(fase: number, acertos: number) {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      let quizResults: { [key: string]: number } = {};
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        quizResults = data.quizResults || {};
      }

      const faseToCategoria: { [key: number]: string } = {
        1: "Matemática",
        2: "Linguagens",
        3: "Ciências da Natureza",
        4: "Ciências Humanas",
      };

      const categoria = faseToCategoria[fase];
      if (!categoria) return;

      quizResults[categoria] = acertos;
      await updateDoc(userDocRef, { quizResults });
    } catch (error) {
      console.error("Erro ao salvar resultado no Firebase:", error);
    }
  }

  useEffect(() => {
    const fase = route.params?.faseConcluida;
    if (fase != null) {
      salvarResultadoNoFirebase(fase, acertos);
    }

    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (e: EventArg<"beforeRemove", true, any>) => {
        e.preventDefault();
      }
    );
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("congratsTitle")}</Text>
        <Text style={styles.subtitle}>{t("quizSuccess")}</Text>

        <Text style={styles.resultText}>
          {t("correctAnswers", { acertos, total })}
        </Text>

        <View style={styles.circleWrapper}>
          <Progress.Circle
            size={240}
            progress={1}
            thickness={8}
            color="#D9534F"
            unfilledColor="#f7f8fa"
            borderWidth={0}
          />
          <Progress.Circle
            size={240}
            progress={porcentagem}
            thickness={8}
            color="#83AF6D"
            unfilledColor="transparent"
            borderWidth={0}
            showsText
            formatText={() => `${Math.round(porcentagem * 100)}%`}
            textStyle={styles.percentageText}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() =>
            navigation.navigate("Mapa", { faseConcluida: route.params?.faseConcluida })
          }
        >
          <Text style={styles.buttonTextPrimary}>{t("backToMap")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Text style={styles.buttonTextSecondary}>{t("viewRanking")}</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}
