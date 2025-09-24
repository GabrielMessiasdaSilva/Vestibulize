import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import GreenModal from "../../components/GreenModal";
import RedModal from "../../components/RedModal";
import EndTimeModal from "../../components/EndTimeModal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { sortearPerguntas } from "../../utils/perguntasLoader";
import type { Pergunta } from "../../data/perguntasQuiz";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import type { RouteProp, NavigationProp, EventArg } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";

export default function Exames() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [perguntaAtual, setPerguntaAtual] = useState(1);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(
    null
  );
  const route = useRoute<RouteProp<RootStackParamList, "Quiz">>();
  const params = route?.params || {};
  const fase = route.params.faseAtual;
  const [perguntasFase, setPerguntasFase] = useState<Pergunta[]>([]);
  const tempoAtivado = route.params.tempoAtivado;
  const tempoTotal = route.params.tempoTotal;
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(tempoTotal);
  const [greenModalVisible, setGreenModalVisible] = useState(false);
  const [redModalVisible, setRedModalVisible] = useState(false);
  const [endTimeModalVisible, setEndTimeModalVisible] = useState(false);
  const scrollRef = React.useRef<ScrollView>(null);
  const { t } = useTranslation();
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [highlightMode, setHighlightMode] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Quando a tela é focada, inicia o timer
      if (tempoAtivado && tempoRestante > 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTempoRestante(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              timerRef.current = null;
              setEndTimeModalVisible(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => {
        // Quando a tela perde o foco, limpa o timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [tempoAtivado, tempoRestante])
  );

  useEffect(() => {
    const sorteadas: Pergunta[] = [
      ...sortearPerguntas("matematica", 14),
      ...sortearPerguntas("linguagens", 14),
      ...sortearPerguntas("ciencias_natureza", 13),
      ...sortearPerguntas("ciencias_humanas", 13),
    ];

    const embaralhadas = sorteadas.sort(() => Math.random() - 0.5);

    setPerguntasFase(embaralhadas);
  }, []);

  useEffect(() => {
    if (tempoAtivado && tempoRestante <= 0) {
      setEndTimeModalVisible(true);
    }
  }, [tempoRestante, tempoAtivado]);

  const pergunta = perguntasFase[perguntaAtual - 1];
  const respostaCorreta = pergunta?.correta;

  useEffect(() => {
    if (perguntasFase.length > 0 && perguntaAtual > perguntasFase.length) {
      navigation.navigate("Conquista", { acertos, faseConcluida: fase });
    }
  }, [perguntaAtual, perguntasFase.length, acertos]);

  function toggleHighlight(wordId: string) {
    if (!highlightMode) return; // só grifa se lápis ativo
    setHighlightedWords((prev) =>
      prev.includes(wordId)
        ? prev.filter((w) => w !== wordId)
        : [...prev, wordId]
    );
  }

  function handleResposta(alternativa: string) {
    setRespostaSelecionada(alternativa);
    if (alternativa === respostaCorreta) {
      setGreenModalVisible(true);
      setAcertos((prev) => prev + 1);
    } else {
      setRedModalVisible(true);
    }
  }

  function proximaPergunta() {
    setGreenModalVisible(false);
    setRespostaSelecionada(null);

    if (perguntaAtual === perguntasFase.length) {
      setTimeout(() => {
        navigation.navigate("Conquista", { acertos, faseConcluida: fase });
      }, 300);
    } else {
      setPerguntaAtual(perguntaAtual + 1);
      rolarParaTopo();
    }
  }

  function respostaErrada() {
    setRedModalVisible(false);
    setRespostaSelecionada(null);

    if (perguntaAtual === perguntasFase.length) {
      setTimeout(() => {
        navigation.navigate("Conquista", { acertos, faseConcluida: fase });
      }, 300);
    } else {
      setPerguntaAtual(perguntaAtual + 1);
      rolarParaTopo();
    }
  }

  function pausarTempo() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function retomarTempo() {
    if (tempoAtivado && tempoRestante > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
    }
  }

  // Calcula minutos e segundos
  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;

  function voltarAoMapa() {
    navigation.navigate("Mapa");
  }

  // Mostra o total de perguntas e a pergunta exibida
  const totalPerguntas = perguntasFase.length;
  const perguntaExibida = Math.min(perguntaAtual, totalPerguntas);

  // Previne o botão de voltar físico (Android) e gestos de navegação (iOS)
  useFocusEffect(
    React.useCallback(() => {
      // Previne botão físico (Android)
      const onBackPress = () => {
        pausarTempo();
        Alert.alert(t("exames.alert.title"), t("exames.alert.message"), [
          {
            text: t("exames.alert.cancel"),
            style: "cancel",
            onPress: () => {
              retomarTempo();
            },
          },
          {
            text: t("exames.alert.exit"),
            style: "destructive",
            onPress: () => navigation.navigate("Home"),
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Previne gestos de navegação (iOS) e back automático
      const unsubscribe = navigation.addListener(
        "beforeRemove",
        (e: EventArg<"beforeRemove", true, any>) => {
          e.preventDefault();
          pausarTempo();
          Alert.alert(t("exames.leaveAlert.title"), t("exames.leaveAlert.message"), [
            {
              text: t("exames.leaveAlert.stay"),
              style: "cancel",
              onPress: () => {
                retomarTempo();
              },
            },
            {
              text: t("exames.leaveAlert.confirm"),
              style: "destructive",
              onPress: () => navigation.navigate("Home"),
            },
          ]);
        });

      return () => {
        backHandler.remove();
        unsubscribe();
      };
    }, [navigation])
  );

  const nomesFases: { [key: number]: string } = {
    1: "Matemática",
    2: "Linguagens",
    3: "Ciências da Natureza",
    4: "Ciências Humanas",
  };

  function rolarParaTopo() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 80,
          backgroundColor: "#f7f8fa",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={28} color="#1C1B1F" />
            <Text style={styles.exitText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructions}>Responda as questões abaixo</Text>
        <View style={styles.faseBox}>
          <Text style={styles.questionCounter}>
            {perguntaExibida}/{totalPerguntas} Questões
          </Text>
          <View style={styles.timerContainer}>
            {tempoAtivado ? (
              <>
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={20}
                  color="#233D4D"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.timerText}>
                  {`${minutos}:${segundos.toString().padStart(2, "0")}`}
                </Text>
              </>
            ) : (
              <View style={{ width: 48 }} />
            )}
          </View>
        </View>
        <View style={styles.question}>
          {pergunta && (
            <View>
              <Text style={[styles.questionText, { flexWrap: "wrap" }]}>
                {`(FATEC ${pergunta.ano}) ${pergunta.texto}`
                  .split(" ")
                  .map((word, index) => {
                    const wordId = `${perguntaAtual}-${index}`;
                    return (
                      <Text
                        key={index}
                        onPress={() => toggleHighlight(wordId)}
                        style={
                          highlightedWords.includes(wordId)
                            ? { backgroundColor: "yellow" }
                            : {}
                        }
                      >
                        {word}
                        {index < pergunta.texto.split(" ").length ? " " : ""}
                      </Text>
                    );
                  })}
              </Text>

              {Object.entries(pergunta.alternativas).map(([letra, texto]) => (
                <TouchableOpacity
                  key={letra}
                  onPress={() => handleResposta(letra)}
                  disabled={!!respostaSelecionada}
                  style={[
                    styles.optionButton,
                    respostaSelecionada === letra
                      ? letra === respostaCorreta
                        ? { backgroundColor: "#A1C181" }
                        : { backgroundColor: "#A92929" }
                      : null,
                    !!respostaSelecionada && respostaSelecionada !== letra
                      ? { opacity: 0.5 }
                      : null,
                  ]}
                >
                  <Text style={styles.optionText}>
                    {letra}) {texto}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <GreenModal visible={greenModalVisible} onContinue={proximaPergunta} />
      <RedModal visible={redModalVisible} onContinue={respostaErrada} />
      <EndTimeModal
        visible={endTimeModalVisible}
        onNavigate={voltarAoMapa}
        acertos={acertos}
      />

      <TouchableOpacity
        style={styles.floatingPencil}
        onPress={() => setHighlightMode((prev) => !prev)}
      >
        <MaterialCommunityIcons
          name="pencil"
          size={28}
          color={highlightMode ? "#FFD700" : "#888"}
        />
      </TouchableOpacity>
    </View>
  );
}