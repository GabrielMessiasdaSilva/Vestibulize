import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

export default function DecidirTempo() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { semestre } = route.params as { semestre: string };

  function iniciarSimulado(usarTempo: boolean) {
    navigation.navigate("Exames", {
      semestre,
      tempoAtivado: usarTempo,
      tempoTotal: usarTempo ? 5 * 60 * 60 : 0,
    });
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "space-between" }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          color: "#005C6D",
          textAlign: "left",
          fontFamily: "PlusJakartaSans_700Bold",
          marginTop: 40,
        }}
      >
        Deseja praticar com o tempo do vestibular?
      </Text>

      <View style={{ marginBottom: 40 }}>
        <TouchableOpacity
          onPress={() => iniciarSimulado(true)}
          style={{
            backgroundColor: "#005C6D",
            paddingVertical: 18,
            borderRadius: 30,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
            Adicionar Tempo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => iniciarSimulado(false)}
          style={{
            backgroundColor: "#CEE7F0",
            paddingVertical: 18,
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4A4459", fontSize: 18, fontWeight: "600" }}>
            Não, sem tempo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}