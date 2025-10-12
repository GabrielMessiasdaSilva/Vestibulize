import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import FatecCard from "../../components/FatecCard";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";
import * as Location from "expo-location";
import { calcularDistancia } from "../../utils/calcularDistancia";

type Fatec = {
  name: string;
  vicinity: string;
  distance: number;
};

export default function Fatecs() {
  const { t } = useTranslation();
  const [fatecs, setFatecs] = useState<Fatec[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission de localização negada");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const apiKey = "...";
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=20000&keyword=FATEC&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      const mapped: Fatec[] = data.results.map((item: any) => {
        const latFatec = item.geometry?.location?.lat || 0;
        const lonFatec = item.geometry?.location?.lng || 0;
        const distancia = calcularDistancia(latitude, longitude, latFatec, lonFatec);

        return {
          name: item.name,
          vicinity: item.vicinity,
          distance: parseFloat(distancia.toFixed(2)),
        };
      });

      setFatecs(mapped.sort((a, b) => a.distance - b.distance));
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>{t("fatecs.title")}</Text>
        <Image source={require('../../../assets/img/local.png')} style={styles.local} />
        <Text style={styles.text}>{t("fatecs.text")}</Text>
        {loading ? (
          <Text>Carregando FATECs próximas...</Text>
        ) : (
          fatecs.map((f, i) => (
            <FatecCard
              key={i}
              name={f.name}
              vicinity={f.vicinity}
              distance="10 km"
              duration="1h 10min"
              onPress={() => navigation.navigate("Fatecs")}
            />
          ))
        )}
      </ScrollView>

      <Footer />
    </View>
  );
}