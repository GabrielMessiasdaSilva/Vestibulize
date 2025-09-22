import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import TimeModal from "../../components/TimeModal";
import Footer from "../../components/Footer";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Mapa() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedTime, setSelectedTime] = useState("none");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTime, setInputTime] = useState("");

  const showCustomAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  const handleActivateTime = () => {
    if (inputTime && Number(inputTime) >= 1 && Number(inputTime) <= 60) {
      setSelectedTime(inputTime);
      setModalVisible(false);
      showCustomAlert(
        t("map.alertTempoAtivadoTitulo"),
        t("map.alertTempoAtivadoMensagem", { tempo: inputTime })
      );
    } else {
      showCustomAlert(
        t("map.alertAtençãoTitulo"),
        t("map.alertAtençãoMensagem")
      );
    }
  };

  const handleDeactivateTime = () => {
    setSelectedTime("none");
    setInputTime("");
    setModalVisible(false);
    showCustomAlert(
      t("map.alertTempoDesativadoTitulo"),
      t("map.alertTempoDesativadoMensagem")
    );
  };

  const [fases, setFases] = useState([
    { numero: 1, status: "disponivel", nome: "matematica" },
    { numero: 2, status: "bloqueada", nome: "linguagens" },
    { numero: 3, status: "bloqueada", nome: "ciencias_humanas" },
    {
      numero: 4,
      status: "bloqueada",
      nome: "ciencias_natureza",
    },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      const carregarProgresso = async () => {
        try {
          const salvo = await AsyncStorage.getItem("fasesConcluidas");
          const fasesConcluidas: number[] = salvo ? JSON.parse(salvo) : [];

          setFases((prev) =>
            prev.map((fase) => {
              if (fasesConcluidas.includes(fase.numero)) {
                return { ...fase, status: "concluida" };
              } else if (
                fasesConcluidas.includes(fase.numero - 1) ||
                fase.numero === 1
              ) {
                return { ...fase, status: "disponivel" };
              } else {
                return { ...fase, status: "bloqueada" };
              }
            })
          );
        } catch (error) {
          console.error("Erro ao carregar progresso:", error);
        }
      };

      carregarProgresso();
    }, [])
  );

  const iniciarFase = (faseNumero: number) => {
    navigation.navigate("Quiz", {
      tempoTotal: selectedTime !== "none" ? Number(selectedTime) * 60 : 0,
      tempoAtivado: selectedTime !== "none",
      faseAtual: faseNumero,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.title}>{t("map.title")}</Text>

        {/* Botão Tempo */}
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#005C6D"
            />
            <Text style={styles.secondaryButtonText}>{t("map.tempo")}</Text>
          </TouchableOpacity>
        </View>

        {/* Fases */}
        <View style={styles.phaseMapContainer}>
          {fases.map((fase, index) => {
            const faseStatus = fase.status;

            const borderColor =
              faseStatus === "concluida"
                ? "#4CAF50"
                : faseStatus === "disponivel"
                ? "#FEC946"
                : "#bbb";

            return (
              <View key={fase.numero} style={styles.phaseRow}>
                {/* Linha vertical */}
                {index > 0 && (
                  <View style={styles.verticalLine}>
                    {fase.status !== "concluida" && (
                      <View style={styles.progressDot} />
                    )}
                  </View>
                )}

                {/* Círculo da fase */}
                <TouchableOpacity
                  disabled={faseStatus !== "disponivel"}
                  onPress={() => iniciarFase(fase.numero)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.phaseCircle,
                      {
                        borderColor,
                        backgroundColor:
                          faseStatus === "concluida" ? "#E6F4EA" : "#fff",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.phaseNumber,
                        {
                          color:
                            faseStatus === "concluida" ? "#4CAF50" : "#333",
                        },
                      ]}
                    >
                      {fase.numero}
                    </Text>

                    {faseStatus === "bloqueada" && (
                      <MaterialCommunityIcons
                        name="lock"
                        size={28}
                        color="#bbb"
                        style={styles.lockIcon}
                      />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Título da fase */}
                <View style={styles.phaseInfo}>
                  <Text
                    style={[
                      styles.subjectTitle,
                      {
                        color: faseStatus === "bloqueada" ? "#aaa" : "#005C6D",
                      },
                    ]}
                  >
                    {t(`map.${fase.nome}`)}
                  </Text>

                  {faseStatus === "concluida" && (
                    <Text style={styles.completedText}>
                      {t("map.concluido")} ✓
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de tempo */}
      <TimeModal
        visible={modalVisible}
        inputTime={inputTime}
        setInputTime={setInputTime}
        onActivate={handleActivateTime}
        onDeactivate={handleDeactivateTime}
        onClose={() => setModalVisible(false)}
      />

      {/* Footer fixo */}
      <Footer />
    </View>
  );
}
