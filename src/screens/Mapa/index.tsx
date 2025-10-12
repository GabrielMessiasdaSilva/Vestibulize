import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
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
  const [resetTimeFlag, setResetTimeFlag] = useState(false);

  const showCustomAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  const handleActivateTime = (tempo: string) => {
    const [m, s] = tempo.split(':').map(Number);
    if ((m || 0) + (s || 0) <= 0) {
      Alert.alert(t("map.alertAtençãoTitulo"), t("map.alertAtençãoMensagem"));
      return;
    }

    setSelectedTime(tempo);
    setModalVisible(false);

    Alert.alert(
      t("map.alertTempoAtivadoTitulo"),
      t("map.alertTempoAtivadoMensagem", { tempo })
    );
  };

  const handleDeactivateTime = () => {
    setSelectedTime("none");
    setInputTime("");
    setResetTimeFlag(true);
    setModalVisible(false);
    // showCustomAlert(
    //   t("map.alertTempoDesativadoTitulo"),
    //   t("map.alertTempoDesativadoMensagem")
    // );
  };

  useEffect(() => {
    if (modalVisible) setResetTimeFlag(false);
  }, [modalVisible]);

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
    let totalSegundos = 0;
    if (selectedTime !== "none") {
      const [m, s] = selectedTime.split(":").map(Number);
      totalSegundos = m * 60 + s;
    }

    navigation.navigate("Quiz", {
      tempoTotal: totalSegundos,
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

        <Text style={styles.title}>{t("map.title")}</Text>

        <View style={styles.topButtons}>
          {selectedTime === "none" ? (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialCommunityIcons name="clock-outline" size={20} color="#005C6D" />
              <Text style={styles.secondaryButtonText}>{t("map.tempo")}</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity style={[styles.secondaryButton, { opacity: 0.7 }]} disabled>
                <MaterialCommunityIcons name="clock-check-outline" size={20} color="#005C6D" />
                <Text style={styles.secondaryButtonText}>{selectedTime}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryButton, { marginLeft: 10, backgroundColor: '#E57373' }]}
                onPress={handleDeactivateTime}
              >
                <Text style={styles.desativar}>Desativar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.phaseMapContainer}>
          {fases.map((fase, index) => {
            const faseStatus = fase.status;

            const borderColor =
              faseStatus === "concluida"
                ? "#005C6D"
                : faseStatus === "disponivel"
                  ? "#FEC946"
                  : "#bbb";

            return (
              <View key={fase.numero} style={styles.phaseRow}>
                {index > 0 && (
                  <View
                    style={[
                      styles.verticalLine,
                      {
                        backgroundColor:
                          fases[index - 1].status === "concluida" ? "#005C6D" : "#bbb",
                      },
                    ]}
                  >
                    {fases[index - 1].status !== "concluida" && (
                      <View style={styles.progressDot} />
                    )}
                  </View>
                )}

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
                            faseStatus === "concluida" ? "#005C6D" : "#333",
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

      <TimeModal
        visible={modalVisible}
        inputTime={inputTime}
        setInputTime={setInputTime}
        onActivate={handleActivateTime}
        onDeactivate={handleDeactivateTime}
        onClose={() => setModalVisible(false)}
        resetTime={resetTimeFlag}
      />

      <Footer />
    </View>
  );
}
