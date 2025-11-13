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
import { styles } from "./styles"; // Seus estilos principais
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
const NAV_BAR_HEIGHT = 80;

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || url.startsWith(PLACEHOLDER_PREFIX)) {
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [respostasUsuario, setRespostasUsuario] = useState<{ [key: number]: string }>({});

  const [tempoRestante, setTempoRestante] = useState(tempoTotal);
  const scrollRef = useRef<ScrollView>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const perguntas = carregarPerguntasProva(exameId);
    setPerguntasProva(perguntas);
    setPerguntaAtualIdx(0);
    setRespostasUsuario({});
    setTempoRestante(tempoTotal);
    setLoading(false);
  }, [exameId, tempoTotal]);

  const calcularEFinalizar = (forceSubmit = false) => {
    pausarTempo();

    const submit = () => {
      const acertosFinais = perguntasProva.reduce((total, pergunta, index) => {
        const respostaUsuario = respostasUsuario[index];
        if (respostaUsuario === pergunta.correta) {
          return total + 1;
        }
        return total;
      }, 0);

      navigation.navigate("ExameConquista", { acertos: acertosFinais });
    };

    if (forceSubmit) {
      Alert.alert(
        t("exames.timeUp.title", "Tempo Esgotado!"),
        t("exames.timeUp.message", "Seu tempo acabou. A prova será finalizada e enviada."),
        [{ text: "OK", onPress: submit }]
      );
      return;
    }

    Alert.alert(
      t("exames.finish.title", "Finalizar Exame"),
      t("exames.finish.message", "Tem certeza que deseja finalizar e enviar suas respostas?"),
      [
        { text: t("exames.finish.cancel", "Cancelar"), style: "cancel", onPress: () => retomarTempo() },
        { text: t("exames.finish.confirm", "Finalizar"), style: "destructive", onPress: submit }
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!loading && tempoAtivado && tempoRestante > 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTempoRestante(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              timerRef.current = null;
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
    }, [loading, tempoAtivado, tempoRestante])
  );

  useEffect(() => {
    if (tempoAtivado && tempoRestante === 0) {
      if (navigation.isFocused()) {
        calcularEFinalizar(true);
      }
    }
  }, [tempoRestante, tempoAtivado, navigation, perguntasProva, respostasUsuario]);

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
        if (e.data.action.type === 'NAVIGATE' && e.data.action.payload && (e.data.action.payload as any).name === 'ExameConquista') {
          return;
        }

        e.preventDefault();
        pausarTempo();
        Alert.alert(t("exames.leaveAlert.title"), t("exames.leaveAlert.message"), [
          { text: t("exames.leaveAlert.stay"), style: "cancel", onPress: () => retomarTempo() },
          { text: t("exames.leaveAlert.confirm"), style: "destructive", onPress: () => navigation.dispatch(e.data.action) },
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
    }, [navigation, t, tempoAtivado, tempoRestante])
  );

  function handleResposta(letraSelecionada: string) {
    setRespostasUsuario(prevRespostas => ({
      ...prevRespostas,
      [perguntaAtualIdx]: letraSelecionada,
    }));
  }

  function pausarTempo() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function retomarTempo() {
    if (!loading && tempoAtivado && tempoRestante > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  function proximaQuestao() {
    if (perguntaAtualIdx < perguntasProva.length - 1) {
      setPerguntaAtualIdx(prevIdx => prevIdx + 1);
      rolarParaTopo();
    }
  }

  function questaoAnterior() {
    if (perguntaAtualIdx > 0) {
      setPerguntaAtualIdx(prevIdx => prevIdx - 1);
      rolarParaTopo();
    }
  }

  const horas = Math.floor(tempoRestante / 3600);
  const minutos = Math.floor((tempoRestante % 3600) / 60);
  const segundos = tempoRestante % 60;

  function rolarParaTopo() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  if (loading || !perguntasProva.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00839A" />
        <Text style={{ marginTop: 10 }}>Carregando prova...</Text>
      </View>
    );
  }

  const pergunta = perguntasProva[perguntaAtualIdx];
  const respostaSelecionada = respostasUsuario[perguntaAtualIdx];
  const isLastQuestion = perguntaAtualIdx === perguntasProva.length - 1;
  const textoCompletoPergunta = `(${pergunta.origem.toUpperCase()} ${pergunta.exame_id}) ${pergunta.texto}`;

  const totalPerguntas = perguntasProva.length;
  const perguntaExibida = totalPerguntas > 0 ? perguntaAtualIdx + 1 : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#f7f8fa",
          paddingBottom: NAV_BAR_HEIGHT + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => {
              pausarTempo();
              Alert.alert(t("exames.alert.title"), t("exames.alert.message"), [
                { text: t("exames.alert.cancel"), style: "cancel", onPress: () => retomarTempo() },
                { text: t("exames.alert.exit"), style: "destructive", onPress: () => navigation.navigate("Home") },
              ]);
            }}
          >
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
          <MathJaxSvg
            fontSize={styles.questionText.fontSize || 16}
            color={styles.questionText.color || '#333'}
            fontCache={true}
            style={styles.mathjaxContainer}
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

          {Object.entries(pergunta.alternativas).map(([letra, texto]) => {
            const isSelected = respostaSelecionada === letra;
            return (
              <TouchableOpacity
                key={letra}
                onPress={() => handleResposta(letra)}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}
                >
                  {letra}) {texto}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[styles.navButton, perguntaAtualIdx === 0 && styles.navButtonDisabled]}
          onPress={questaoAnterior}
          disabled={perguntaAtualIdx === 0}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color={perguntaAtualIdx === 0 ? "#999" : "#FFF"} />
          <Text style={[styles.navButtonText, perguntaAtualIdx === 0 && { color: "#999" }]}>Anterior</Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.navButton, styles.finishButton]}
            onPress={() => calcularEFinalizar(false)}
          >
            <Text style={[styles.navButtonText, styles.finishButtonText]}>Finalizar</Text>
            <MaterialCommunityIcons name="check-all" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navButton}
            onPress={proximaQuestao}
          >
            <Text style={styles.navButtonText}>Próxima</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}