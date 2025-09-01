import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { cards } from './styles';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type Prova = { semestre: string; questoes: number };

export default function Card({ provas }: { provas: Prova[] }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  
  const renderItem = ({ item }: { item: { semestre: string; questoes: number } }) => (
    <View style={cards.card}>
      <View style={{ flex: 1 }}>
        <Text style={cards.semestre}>{item.semestre}</Text>
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
      <TouchableOpacity style={cards.buttonIniciar}
        onPress={() =>
          navigation.navigate("Exames")
        }>
        <Text style={cards.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={provas}
      keyExtractor={(item) => item.semestre}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      scrollEnabled={false}
      ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhuma prova encontrada</Text>}
    />
  );
}