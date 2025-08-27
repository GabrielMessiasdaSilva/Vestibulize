import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';
import Card from '../../components/Cards';
import Footer from '../../components/Footer';
import { useUser } from "../../services/userContext";
import { useTranslation } from 'react-i18next';
import { useNavigation, EventArg } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const materias: { nome: string; }[] = [
  { nome: 'Matemática' },
  { nome: 'Língua Portuguesa' },
  { nome: 'Língua Estrangeira' },
  { nome: 'Biologia' },
  { nome: 'Química' },
  { nome: 'Física' },
  { nome: 'História' },
  { nome: 'Geografia' },
];

const iconsMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  "Língua Portuguesa": "book-open-page-variant",
  "Língua Estrangeira": "translate",
  "Matemática": "calculator",
  "Biologia": "leaf",
  "Química": "flask",
  "Física": "atom",
  "História": "script-text-outline",
  "Geografia": "map",
  "Filosofia": "lightbulb-on-outline",
  "Sociologia": "account-group",
};

const assuntosPorMateria: Record<string, string[]> = {
  'Matemática': [
    'assuntos.Matematica.geometria',
    'assuntos.Matematica.algebra',
    'assuntos.Matematica.grandezas',
    'assuntos.Matematica.estatistica',
    'assuntos.Matematica.analiseGrafica',
  ],
  'Língua Portuguesa': [
    'assuntos.Linguas.interpretacao',
    'assuntos.Linguas.gramatica',
    'assuntos.Linguas.literatura',
  ],
  'Língua Estrangeira': [
    'assuntos.Linguas.compreensao',
    'assuntos.Linguas.vocabulario',
  ],
  'Biologia': [
    'assuntos.Biologia.genetica',
    'assuntos.Biologia.ecologia',
    'assuntos.Biologia.citologia',
    'assuntos.Biologia.fisiologia',
  ],
  'Química': [
    'assuntos.Quimica.geral',
    'assuntos.Quimica.fisico',
    'assuntos.Quimica.organica',
  ],
  'Física': [
    'assuntos.Fisica.mecanica',
    'assuntos.Fisica.termologia',
    'assuntos.Fisica.optica',
    'assuntos.Fisica.ondulatoria',
    'assuntos.Fisica.eletromagnetismo',
  ],
  'História': [
    'assuntos.Historia.historiaBrasil',
    'assuntos.Historia.historiaGeral',
    'assuntos.Historia.idadeModerna',
  ],
  'Geografia': [
    'assuntos.Geografia.geografiaBrasil',
    'assuntos.Geografia.geopolitica',
    'assuntos.Geografia.cartografia',
    'assuntos.Geografia.meioAmbiente',
  ]
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const { username } = useUser();
  const [busca, setBusca] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, backgroundColor: '#f7f8fa' }} showsVerticalScrollIndicator={false}>
        <View style={styles.topHome}>
          <View style={styles.logoContainer}>
            <Image source={require("../../../assets/img/logoCPS-branco.png")} style={styles.logo} />
          </View>
          <Text style={styles.greeting}>{t('home.greeting', { nome: username })}</Text>
          <Text style={styles.title}>{t('home.title')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
          <View style={{ marginBottom: 36 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.buttonsLayer}
            >
              {materias.map((materia) => (
                <TouchableOpacity
                  key={materia.nome}
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate("Materia", {
                      nome: materia.nome,
                      assuntos: assuntosPorMateria[materia.nome],
                    })
                  }
                >
                  <MaterialCommunityIcons
                    name={iconsMap[materia.nome]}
                    size={20}
                    color="#233D4D"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>
                    {materia.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.searchContainer}
          onPress={() => inputRef.current && inputRef.current.focus()}
        >
          <TextInput
            ref={inputRef}
            style={styles.searchText}
            placeholder={isFocused ? '' : t('home.searchPlaceholder')}
            value={busca}
            onChangeText={text => setBusca(text.slice(0, 18))}
            maxLength={18}
            placeholderTextColor="#40484B"
            underlineColorAndroid="transparent"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <MaterialCommunityIcons name="magnify" size={24} color="#40484B" />
        </TouchableOpacity>
        <Card />
      </ScrollView>
      <Footer />
    </View>
  );
}
