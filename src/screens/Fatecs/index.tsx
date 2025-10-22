import {
  View, Text, ScrollView, Image, ActivityIndicator,
  TextInput, TouchableOpacity
} from "react-native";
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
import { GOOGLE_MAPS_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Fatec = {
  place_id: string;
  name: string;
  vicinity: string;
  distanceText: string;
  durationText: string;
  distanceValue: number;
};

const CACHE_KEY = '@FatecsApp:fatecs_cache';
const CACHE_INVALIDATION_DISTANCE_KM = 5;

export default function Fatecs() {
  const { t } = useTranslation();
  const [fatecs, setFatecs] = useState<Fatec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const apiKey = GOOGLE_MAPS_API_KEY;
  const [showCepInput, setShowCepInput] = useState(false);
  const [cep, setCep] = useState('');

  useEffect(() => {
    const loadFatecs = async () => {
      setLoading(true);
      setError(null);

      const cachedDataJSON = await AsyncStorage.getItem(CACHE_KEY);
      const cachedData = cachedDataJSON ? JSON.parse(cachedDataJSON) : null;

      let location = null;
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          location = await Location.getCurrentPositionAsync({});
        }
      } catch (e) {
        console.log("Não foi possível pegar a localização atual");
      }

      if (cachedData && location) {
        const distance = calcularDistancia(
          location.coords.latitude,
          location.coords.longitude,
          cachedData.location.latitude,
          cachedData.location.longitude
        );

        if (distance < CACHE_INVALIDATION_DISTANCE_KM) {
          console.log("Usando dados do cache. Distância:", distance.toFixed(2), "km");
          setFatecs(cachedData.fatecs);
          setLoading(false);
          return;
        }
      }

      if (location) {
        fetchAndCacheFatecs(location.coords.latitude, location.coords.longitude);
      } else {
        setShowCepInput(true);
        setLoading(false);
      }
    };

    loadFatecs();
  }, []);

  const fetchAndCacheFatecs = async (latitude: number, longitude: number) => {
    setLoading(true);
    setShowCepInput(false);
    setError(null);

    try {
      const userLocation = `${latitude},${longitude}`;

      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation}&radius=50000&type=university&keyword=FATEC&key=${apiKey}`;
      const nearbyResponse = await fetch(nearbyUrl);
      const nearbyData = await nearbyResponse.json();

      if (nearbyData.status !== "OK" || nearbyData.results.length === 0) {
        setError(t("fatecs.notFound"));
        setLoading(false);
        return;
      }

      const destinations = nearbyData.results.map((item: any) => `place_id:${item.place_id}`).join('|');
      const matrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLocation}&destinations=${destinations}&key=${apiKey}`;

      const matrixResponse = await fetch(matrixUrl);
      const matrixData = await matrixResponse.json();

      if (matrixData.status !== "OK") {
        throw new Error("Erro ao calcular distâncias.");
      }

      const fatecsEncontradas: Fatec[] = nearbyData.results.map((item: any, index: number) => {
        const element = matrixData.rows[0].elements[index];

        return {
          place_id: item.place_id,
          name: item.name,
          vicinity: item.vicinity,
          distanceText: element.distance?.text || "N/A",
          durationText: element.duration?.text || "N/A",
          distanceValue: element.distance?.value || Infinity,
        };
      });

      const sortedFatecs = fatecsEncontradas.sort((a, b) => a.distanceValue - b.distanceValue);

      const dataToCache = {
        location: { latitude, longitude },
        fatecs: sortedFatecs,
        timestamp: new Date().getTime(),
      };

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
      setFatecs(sortedFatecs);
    } catch (err) {
      console.error(err);
      setError(t("fatecs.genericError") || "Não foi possível buscar as FATECs.");
    } finally {
      setLoading(false);
    }
  };
  const getCoordsFromCep = async (cepValue: string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cepValue}&region=BR&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      return null;
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      return null;
    }
  };

  const handleCepSubmit = async () => {
    if (!cep) {
      setError("Por favor, digite um CEP.");
      return;
    }
    setLoading(true);
    setError(null);

    const coords = await getCoordsFromCep(cep);
    if (coords) {
      fetchAndCacheFatecs(coords.lat, coords.lng);
    } else {
      setError("CEP inválido ou não encontrado.");
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />;
    }

    if (error) {
      return <Text style={[styles.text, { color: 'red' }]}>{error}</Text>;
    }

    if (fatecs.length === 0) {
      return <Text style={styles.text}>{t("fatecs.notFound")}</Text>
    }

    return fatecs.map((f) => (
      <FatecCard
        key={f.place_id}
        name={f.name}
        vicinity={f.vicinity}
        distance={f.distanceText}
        duration={f.durationText}
      // onPress={() => navigation.navigate("FatecDetail", { placeId: f.place_id })}
      />
    ));
  };
  if (showCepInput) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { alignItems: 'center', paddingTop: 50 }]}>
          <Text style={styles.title}>Usar Localização</Text>
          <Image source={require('../../../assets/img/local.png')} style={styles.local} />
          <Text style={[styles.text, { textAlign: 'center', marginVertical: 15 }]}>
            Não conseguimos pegar sua localização automaticamente.
            Por favor, digite seu CEP para buscarmos as FATECs próximas.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="00000-000"
            keyboardType="numeric"
            value={cep}
            onChangeText={setCep}
            maxLength={9}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleCepSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Buscar por CEP</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="small" style={{ marginTop: 20 }} />}
          {error && <Text style={{ color: 'red', marginTop: 20, textAlign: 'center' }}>{error}</Text>}

        </ScrollView>
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("fatecs.title")}</Text>
        <Image source={require('../../../assets/img/local.png')} style={styles.local} />
        <Text style={styles.text}>{t("fatecs.text")}</Text>
        {renderContent()}
      </ScrollView>
      <Footer />
    </View>
  );
}