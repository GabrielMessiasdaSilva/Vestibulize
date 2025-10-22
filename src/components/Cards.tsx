import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { cards } from './styles';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type ProvaInfo = {
  id: string;
  nome: string;
  questoes: number;
};

const provasDisponiveis: ProvaInfo[] = [
  { id: 'fatec_2024_s2', nome: 'Vestibular FATEC 2º Sem/2024', questoes: 54, },
  { id: 'fatec_2024_s1', nome: 'Vestibular FATEC 1º Sem/2024', questoes: 54, },
  { id: 'fatec_2023_s2', nome: 'Vestibular FATEC 2º Sem/2023', questoes: 54, },
  { id: 'fatec_2023_s1', nome: 'Vestibular FATEC 1º Sem/2023', questoes: 54, },
  { id: 'fatec_2022_s2', nome: 'Vestibular FATEC 2º Sem/2022', questoes: 54, },
  { id: 'fatec_2020_s1', nome: 'Vestibular FATEC 1º Sem/2020', questoes: 54, },
];

export default function Card({ busca }: { busca: string }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  const provasFiltradas = provasDisponiveis.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const renderItem = ({ item }: { item: ProvaInfo }) => (
    <View style={cards.card}>
      <View style={{ flex: 1 }}>
        <Text style={cards.semestre}>{item.nome}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <MaterialCommunityIcons
            name='file-question-outline'
            size={20}
            color="#4C636A"
            style={{ marginRight: 8 }}
          />
          <Text style={cards.questoes}>{item.questoes} Questões</Text>
        </View>
      </View>
      <TouchableOpacity
        style={cards.buttonIniciar}
        onPress={() =>
          navigation.navigate("DecidirTempo", {
            semestre: item.id,
          })
        }
      >
        <Text style={cards.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={provasFiltradas}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      scrollEnabled={false}
      ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhuma prova encontrada</Text>}
    />
  );
}