import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { cards } from './styles';

const provas = [
  { semestre: '2° Semestre 2025', questoes: 64 },
  { semestre: '1° Semestre 2025', questoes: 60 },
  { semestre: '2° Semestre 2024', questoes: 62 },
];

export default function Card() {
  const renderItem = ({ item }: { item: { semestre: string; questoes: number } }) => (
    <View style={cards.card}>
      <View style={{ flex: 1 }}>
        <Text style={cards.semestre}>{item.semestre}</Text>
        <Text style={cards.questoes}>{item.questoes} Questões</Text>
      </View>
      <TouchableOpacity style={cards.buttonIniciar}>
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
    />
  );
}