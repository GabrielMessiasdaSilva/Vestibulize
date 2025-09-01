import { View, Text, ScrollView, Alert, TouchableOpacity, Animated, Image } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import TimeModal from '../../components/TimeModal';
import TimeButton from '../../components/TimeButton';
import AnimatedPhaseCircle from "../../components/AnimatedPhaseCircle";
import Footer from '../../components/Footer';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    { numero: 3, status: "bloqueada", nome: "ciencias_natureza" },
    {
      numero: 4,
      status: "bloqueada",
      nome: "ciencias_humanas",
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, backgroundColor: '#f7f8fa' }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('map.title')}</Text>
        <TimeButton
          selectedTime={selectedTime}
          onPress={() => setModalVisible(true)}
        />
        <View style={styles.phaseMapContainer}>
          {fases.map((fase, index) => {
            const faseStatus = fase.status;
            const borderColor =
              faseStatus === "concluida"
                ? "#4CAF50"
                : faseStatus === "disponivel"
                  ? "#005C6D"
                  : "#bbb";

            return (
              <View key={fase.numero} style={styles.phaseItem}>
                <TouchableOpacity
                  disabled={faseStatus !== "disponivel"}
                  onPress={() => iniciarFase(fase.numero)}
                  activeOpacity={0.7}
                >
                  <AnimatedPhaseCircle
                    isActive={faseStatus === "disponivel"}
                    style={[
                      styles.phaseCircle,
                      {
                        backgroundColor:
                          faseStatus === "concluida" ? "#4CAF50" : "#fff",
                        borderColor,
                        shadowColor:
                          faseStatus === "disponivel"
                            ? "#FEC946"
                            : "transparent",
                        elevation: faseStatus === "disponivel" ? 10 : 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.phaseNumber,
                        {
                          color: faseStatus === "concluida" ? "#fff" : "#333",
                        },
                      ]}
                    >
                      {fase.numero}
                    </Text>

                    {faseStatus === "bloqueada" && (
                      <MaterialCommunityIcons name="lock" size={28} color="#bbb" style={styles.iconBlocked} />
                    )}
                  </AnimatedPhaseCircle>
                </TouchableOpacity>

                <Text
                  style={[
                    styles.subjectTitle,
                    { color: faseStatus === "bloqueada" ? "#aaa" : "#444" },
                  ]}
                >
                  {t(`map.${fase.nome}`)}
                </Text>

                {index < fases.length - 1 && (
                  <View style={styles.lineContainer}>
                    {/* Linha vertical entre as fases */}
                    <View
                      style={{
                        width: 4,
                        height:
                          fases[index].status === "concluida"
                            ? 70 // linha maior se fase concluída
                            : 40, // linha padrão caso contrário
                        backgroundColor:
                          fases[index].status === "concluida" &&
                            fases[index + 1].status !== "bloqueada"
                            ? "#4CAF50"
                            : "#ccc",
                        borderRadius: 2,
                      }}
                    />
                    {/* Círculo indicador no meio da linha */}
                    <View
                      style={{
                        position: "absolute",
                        top:
                          fases[index].status === "concluida"
                            ? 58 // posicionado perto do fim da linha maior
                            : 18, // no meio da linha menor
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor:
                          fases[index].status === "concluida" &&
                            fases[index + 1].status !== "bloqueada"
                            ? "#4CAF50"
                            : "#ccc",
                        borderWidth: 2,
                        borderColor: "#fff",
                        elevation: 3,
                      }}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView >
      <TimeModal
        visible={modalVisible}
        inputTime={inputTime}
        setInputTime={setInputTime}
        onActivate={handleActivateTime}
        onDeactivate={handleDeactivateTime}
        onClose={() => setModalVisible(false)}
      />
      <Footer />
    </View >
  );
}