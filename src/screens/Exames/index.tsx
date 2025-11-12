import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { styles } from "./styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { sortearPerguntas } from "../../utils/perguntasLoader";
import { carregarPerguntasProva } from "../../utils/perguntasLoader";
import type { Pergunta } from "../../data/perguntasQuiz";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import type { RouteProp, NavigationProp, EventArg } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';

const PLACEHOLDER_PREFIX = "[SEU_PATH_IMAGENS]";

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }
  if (url.startsWith(PLACEHOLDER_PREFIX)) {
    return false;
  }
  return true;
}

export default function Exames() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Exames">>();
  const exameId = route.params.semestre;
  const tempoAtivado = route.params.tempoAtivado;
  const tempoTotal = route.params.tempoTotal;
  const [perguntasProva, setPerguntasProva] = useState<Pergunta[]>([]);
  const [perguntaAtualIdx, setPerguntaAtualIdx] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(tempoTotal);
  const scrollRef = React.useRef<ScrollView>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const perguntas = carregarPerguntasProva(exameId);
    setPerguntasProva(perguntas);
    setPerguntaAtualIdx(0);
    setAcertos(0);
    setTempoRestante(tempoTotal);
    setLoading(false);
  }, [exameId, tempoTotal]);

  useFocusEffect(
    React.useCallback(() => {
      if (tempoAtivado && tempoRestante > 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTempoRestante(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              timerRef.current = null;
              navigation.navigate("ExameConquista", { acertos });
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
    }, [tempoAtivado, tempoRestante, navigation, acertos])
  );

  const pergunta = perguntasProva[perguntaAtualIdx];
  const respostaCorreta = pergunta?.correta;

  function handleResposta(alternativa: string) {
    if (alternativa === respostaCorreta) {
      setAcertos(prev => prev + 1);
    }
    setTimeout(() => {
      if (perguntaAtualIdx === perguntasProva.length - 1) {
        navigation.navigate("ExameConquista", { acertos });
      } else {
        setPerguntaAtualIdx(prevIdx => prevIdx + 1);
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
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [navigation, t])
  );

  if (loading || !pergunta) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#00839A" />
        <Text style={{ marginTop: 10 }}>Carregando prova...</Text>
      </View>
    );
  }
  const textoCompletoPergunta = `(FATEC ${pergunta.exame_id}) ${pergunta.texto}`;

  const totalPerguntas = perguntasProva.length;
  const perguntaExibida = totalPerguntas > 0 ? perguntaAtualIdx + 1 : 0;

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
              <MathJaxSvg
                fontSize={styles.questionText.fontSize}
                color={styles.questionText.color}
                fontCache={true}
              >
                {textoCompletoPergunta}
              </MathJaxSvg>

              {pergunta.imagem_url && (
                isValidImageUrl(pergunta.imagem_url) ? (
                  <Image
                    source={{ uri: pergunta.imagem_url }}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <MaterialCommunityIcons name="image-off-outline" size={40} color="#AAA" />
                    <Text style={styles.placeholderText}>Imagem indisponível</Text>
                  </View>
                )
              )}

              {Object.entries(pergunta.alternativas).map(([letra, texto]) => (
                <TouchableOpacity key={letra} onPress={() => handleResposta(letra)} style={styles.optionButton}>
                  <Text style={styles.optionText}>{letra}) {texto}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
