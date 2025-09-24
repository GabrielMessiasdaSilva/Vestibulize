import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';
import Card from '../../components/Cards';
import Subjects from "../../components/Subjects";
import Footer from '../../components/Footer';
import { useUser } from "../../services/userContext";
import { useTranslation } from 'react-i18next';
import { useNavigation, EventArg } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { MaterialCommunityIcons } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const provas = [
  { semestre: '2° Semestre 2025', questoes: 54 },
  { semestre: '1° Semestre 2025', questoes: 54 },
  { semestre: '2° Semestre 2024', questoes: 54 },
];

export default function Home() {
  const { username } = useUser();
  const [busca, setBusca] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const provasFiltradas = provas.filter((p) =>
    p.semestre.toLowerCase().includes(busca.toLowerCase())
  );  

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
          <Subjects />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.searchContainer}
          onPress={() => inputRef.current && inputRef.current.focus()}
        >
          <TextInput
            ref={inputRef}
            style={styles.searchText}
            placeholder={isFocused ? t('home.searchExample') : t('home.searchPlaceholder')}
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
        <Text style={styles.examsText}>{t('home.examsText')}</Text>
        <Card provas={provasFiltradas}/>
      </ScrollView>
      <Footer />
    </View>
  );
}
