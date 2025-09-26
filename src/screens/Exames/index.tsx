import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "./styles";
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
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, "Quiz">>();
  const fase = route.params.faseAtual;
  const [perguntasFase, setPerguntasFase] = useState<Pergunta[]>([]);
  const tempoAtivado = route.params.tempoAtivado;
  const tempoTotal = route.params.tempoTotal;
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(tempoTotal);
  const scrollRef = React.useRef<ScrollView>(null);
  const { t } = useTranslation();
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [highlightMode, setHighlightMode] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (tempoAtivado && tempoRestante > 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTempoRestante(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              timerRef.current = null;
              navigation.navigate("Conquista", { acertos, faseConcluida: fase });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => {
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

  const pergunta = perguntasFase[perguntaAtual - 1];
  const respostaCorreta = pergunta?.correta;

  function toggleHighlight(wordId: string) {
    if (!highlightMode) return;
    setHighlightedWords(prev =>
      prev.includes(wordId)
        ? prev.filter(w => w !== wordId)
        : [...prev, wordId]
    );
  }

  function handleResposta(alternativa: string) {
    if (alternativa === respostaCorreta) {
      setAcertos(prev => prev + 1);
    }
    // Passa imediatamente para a próxima pergunta
    setTimeout(() => {
      if (perguntaAtual === perguntasFase.length) {
        navigation.navigate("ExameConquista", { acertos});
      } else {
        setPerguntaAtual(perguntaAtual + 1);
        rolarParaTopo();
      }
    }, 200);
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
        setTempoRestante(prev => prev - 1);
      }, 1000);
    }
  }

  const horas = Math.floor(tempoRestante / 3600);
  const minutos = Math.floor((tempoRestante % 3600) / 60);
  const segundos = tempoRestante % 60;

  function rolarParaTopo() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  // Bloqueio de botão de voltar físico
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        pausarTempo();
        Alert.alert(t("exames.alert.title"), t("exames.alert.message"), [
          { text: t("exames.alert.cancel"), style: "cancel", onPress: () => retomarTempo() },
          { text: t("exames.alert.exit"), style: "destructive", onPress: () => navigation.navigate("Home") },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      const unsubscribe = navigation.addListener("beforeRemove", (e: EventArg<"beforeRemove", true, any>) => {
        e.preventDefault();
        pausarTempo();
        Alert.alert(t("exames.leaveAlert.title"), t("exames.leaveAlert.message"), [
          { text: t("exames.leaveAlert.stay"), style: "cancel", onPress: () => retomarTempo() },
          { text: t("exames.leaveAlert.confirm"), style: "destructive", onPress: () => navigation.navigate("Home") },
        ]);
      });

      return () => {
        backHandler.remove();
        unsubscribe();
      };
    }, [navigation])
  );

  const totalPerguntas = perguntasFase.length;
  const perguntaExibida = Math.min(perguntaAtual, totalPerguntas);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, backgroundColor: "#f7f8fa" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#1C1B1F" />
            <Text style={styles.exitText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructions}>Responda as questões abaixo</Text>
        <View style={styles.faseBox}>
          <Text style={styles.questionCounter}>{perguntaExibida}/{totalPerguntas} Questões</Text>
          <View style={styles.timerContainer}>
            {tempoAtivado ? (
              <>
                <MaterialCommunityIcons name="timer-outline" size={20} color="#233D4D" style={{ marginRight: 4 }} />
                <Text style={styles.timerText}>
                  {`${horas}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`}
                </Text>
              </>
            ) : <View style={{ width: 48 }} />}
          </View>
        </View>

        <View style={styles.question}>
          {pergunta && (
            <View>
              <Text style={[styles.questionText, { flexWrap: "wrap" }]}>
                {`(FATEC ${pergunta.ano}) ${pergunta.texto}`.split(" ").map((word, index) => {
                  const wordId = `${perguntaAtual}-${index}`;
                  return (
                    <Text
                      key={index}
                      onPress={() => toggleHighlight(wordId)}
                      style={highlightedWords.includes(wordId) ? { backgroundColor: "yellow" } : {}}
                    >
                      {word}{" "}
                    </Text>
                  );
                })}
              </Text>

              {Object.entries(pergunta.alternativas).map(([letra, texto]) => (
                <TouchableOpacity key={letra} onPress={() => handleResposta(letra)} style={styles.optionButton}>
                  <Text style={styles.optionText}>{letra}) {texto}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingPencil} onPress={() => setHighlightMode(prev => !prev)}>
        <MaterialCommunityIcons name="pencil" size={28} color={highlightMode ? "#FFD700" : "#888"} />
      </TouchableOpacity>
    </View>
  );
}
