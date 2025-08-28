import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { subjects } from "./styles";

const materias: { nome: string }[] = [
  { nome: "Matemática" },
  { nome: "Língua Portuguesa" },
  { nome: "Língua Estrangeira" },
  { nome: "Biologia" },
  { nome: "Química" },
  { nome: "Física" },
  { nome: "História" },
  { nome: "Geografia" },
];

const iconsMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  "Língua Portuguesa": "book-open-page-variant",
  "Língua Estrangeira": "translate",
  Matemática: "calculator",
  Biologia: "leaf",
  Química: "flask",
  Física: "atom",
  História: "script-text-outline",
  Geografia: "map",
  Filosofia: "lightbulb-on-outline",
  Sociologia: "account-group",
};

const assuntosPorMateria: Record<string, string[]> = {
  Matemática: [
    "assuntos.Matematica.geometria",
    "assuntos.Matematica.algebra",
    "assuntos.Matematica.grandezas",
    "assuntos.Matematica.estatistica",
    "assuntos.Matematica.analiseGrafica",
  ],
  "Língua Portuguesa": [
    "assuntos.Linguas.interpretacao",
    "assuntos.Linguas.gramatica",
    "assuntos.Linguas.literatura",
  ],
  "Língua Estrangeira": [
    "assuntos.Linguas.compreensao",
    "assuntos.Linguas.vocabulario",
  ],
  Biologia: [
    "assuntos.Biologia.genetica",
    "assuntos.Biologia.ecologia",
    "assuntos.Biologia.citologia",
    "assuntos.Biologia.fisiologia",
  ],
  Química: [
    "assuntos.Quimica.geral",
    "assuntos.Quimica.fisico",
    "assuntos.Quimica.organica",
  ],
  Física: [
    "assuntos.Fisica.mecanica",
    "assuntos.Fisica.termologia",
    "assuntos.Fisica.optica",
    "assuntos.Fisica.ondulatoria",
    "assuntos.Fisica.eletromagnetismo",
  ],
  História: [
    "assuntos.Historia.historiaBrasil",
    "assuntos.Historia.historiaGeral",
    "assuntos.Historia.idadeModerna",
  ],
  Geografia: [
    "assuntos.Geografia.geografiaBrasil",
    "assuntos.Geografia.geopolitica",
    "assuntos.Geografia.cartografia",
    "assuntos.Geografia.meioAmbiente",
  ],
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function Subjects() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ marginBottom: 36 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={subjects.buttonsLayer}
      >
        {materias.map((materia) => (
          <TouchableOpacity
            key={materia.nome}
            style={subjects.button}
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
            <Text style={subjects.buttonText}>{materia.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}