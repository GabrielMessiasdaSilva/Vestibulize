import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation, useRoute, EventArg } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../services/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function ExameConquista() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const acertos = route.params?.acertos ?? 0;
  const total = 54; // total de questões do exame

  // Salva resultado do exame no Firebase
  async function salvarResultadoExame(acertos: number) {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      let exameResults: { exame?: number } = {};
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        exameResults = data.exameResults || {};
      }

      exameResults["Exame"] = acertos;
      await updateDoc(userDocRef, { exameResults });
    } catch (error) {
      console.error("Erro ao salvar resultado do exame no Firebase:", error);
    }
  }

  useEffect(() => {
    salvarResultadoExame(acertos);

    // Bloqueia botão de voltar físico
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
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="emoticon" size={150} color="#00bcd4" />
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.title}>Exame finalizado!</Text>
        <Text style={styles.subtitle}>
          Acertou {acertos}/{total} questões.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Tela Inicial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 40,
  },
  bottomContent: {
    width: width * 1.5,
    flex: 1,
    backgroundColor: "#00bcd4",
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  backText: {
    color: "#008080",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
