import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { useNavigation, EventArg } from "@react-navigation/native";
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
 
type RootStackParamList = { Mapa: undefined; };
 
export default function Vida() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Mapa'>>();
  const { t } = useTranslation();
 
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
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="heart-broken" size={150} color="#B71C1C" />
      </View>
 
      <View style={styles.bottomContent}>
        <Text style={styles.title}>Acabou suas chances</Text>
 
        <TouchableOpacity
          onPress={() => navigation.navigate("Mapa")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Voltar ao Mapa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}