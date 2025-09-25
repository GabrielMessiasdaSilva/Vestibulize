import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, TouchableOpacity, StatusBar,
  ActivityIndicator, Alert, Image, TextInput, Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../../src/services/firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bottomNavHeight = 80;

interface UserData {
  username: string;
  photoURL?: string;
  quizResults?: { [key: string]: number };
}

interface RankingItem {
  materia: string;
  acertos: number;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhoto, setNewPhoto] = useState<string | null>(null);

  const navigation = useNavigation();
  const userId = auth.currentUser?.uid;

  // Carrega dados locais do AsyncStorage se existirem
  const loadLocalUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@userData');
      if (storedData) {
        const parsedData: UserData = JSON.parse(storedData);
        setUserData(parsedData);
        setNewName(parsedData.username);
        setNewPhoto(parsedData.photoURL || null);

        // Ranking
        if (parsedData.quizResults) {
          const ranking: RankingItem[] = Object.entries(parsedData.quizResults)
            .map(([materia, acertos]) => ({ materia, acertos }))
            .sort((a, b) => b.acertos - a.acertos)
            .slice(0, 3);
          setRankingData(ranking);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados locais:', error);
    }
  };

  // Escuta os dados do usuário em tempo real
  useEffect(() => {
    loadLocalUserData();

    if (!userId) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLoading(false);
        return;
      }
      const data = snapshot.data() as UserData;
      setUserData(data);
      setNewName(data.username);
      setNewPhoto(data.photoURL || null);

      // Ranking: top 3 matérias com mais acertos
      if (data.quizResults) {
        const ranking: RankingItem[] = Object.entries(data.quizResults)
          .map(([materia, acertos]) => ({ materia, acertos }))
          .sort((a, b) => b.acertos - a.acertos)
          .slice(0, 3);
        setRankingData(ranking);
      }
      setLoading(false);

      // Atualiza AsyncStorage com os dados mais recentes
      AsyncStorage.setItem('@userData', JSON.stringify(data)).catch(err => console.error(err));
    });

    return () => unsubscribe();
  }, [userId]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'É preciso permitir acesso às fotos.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setNewPhoto(pickerResult.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!userId) return;
    setUploading(true);

    try {
      const photoURL = newPhoto || userData?.photoURL || '';

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: newName,
          photoURL,
        });
      }

      const updatedData: UserData = { username: newName, photoURL };
      await updateDoc(doc(db, 'users', userId), { username: newName, photoURL });
      setUserData(updatedData);

      // Salva localmente
      await AsyncStorage.setItem('@userData', JSON.stringify(updatedData));

      Alert.alert('Sucesso', 'Perfil atualizado!');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.clear(); // Limpa todos os dados locais
      navigation.dispatch(StackActions.replace('Onboarding'));
    } catch (error) {
      console.error('Erro ao deslogar:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00839A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8F7" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomNavHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card fundo */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardContent}>
            {/* Botão Editar no topo direito */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialIcon name="pencil-outline" size={16} color="#000" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            {/* Avatar e nome */}
            <View style={styles.avatarRow}>
              <View style={styles.avatarWrapper}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  {uploading ? (
                    <View style={styles.avatar}>
                      <ActivityIndicator size="small" color="#004A5A" />
                    </View>
                  ) : userData?.photoURL ? (
                    <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatar}>
                      <Icon name="person" size={40} color="#004A5A" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.name}>{userData?.username || 'Nome'}</Text>
            </View>
          </View>
        </View>

        {/* Card de Opções */}
        <View style={styles.optionsCard}>
          <TouchableOpacity style={styles.optionRow} onPress={() => setTermsVisible(true)}>
            <Text style={styles.optionText}>Termos e condições</Text>
            <MaterialIcon name="arrow-top-right" size={24} color="#004A5A" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.optionRow}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair da conta</Text>
            <MaterialIcon name="logout" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        <View style={styles.rankingSection}>
          <Text style={styles.rankingTitle}>Ranking</Text>
          <Text style={styles.rankingDescription}>
            Analisamos seu desempenho e este é o ranking das suas 3 matérias com maior
            número de acertos. Elas são seus maiores aliados na busca pela aprovação.
          </Text>
          {/* Lista de matérias abaixo do gráfico */}
          <View style={styles.rankingList}>
            {rankingData.map((item, index) => (
              <View key={index} style={styles.rankingItem}>
                <View style={styles.rankingNumber}>
                  <Text style={styles.rankingNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.rankingItemText}>{item.materia}</Text>
              </View>
            ))}
          </View>
          {/* Verificação para garantir que há dados para exibir */}
          {rankingData.length > 0 && (
            <>
              {/* Container do gráfico de barras */}
              <View style={styles.rankingChartContainer}>
                {/* Barra Esquerda (2º Lugar) */}
                {rankingData[1] && (
                  <View style={[styles.rankingBar, styles.rankingBarSide]}>
                    <View style={styles.rankCircle}>
                      <Text style={styles.rankCircleTextSide}>2</Text>
                    </View>
                    <Text style={styles.barText}>{rankingData[1].acertos}</Text>
                    <Text style={styles.barSubText}>Acertos</Text>
                  </View>
                )}

                {/* Barra Central (1º Lugar) */}
                {rankingData[0] && (
                  <View style={[styles.rankingBar, styles.rankingBarCenter]}>
                    <View style={[styles.rankCircle, styles.rankCircleCenter]}>
                      <Text style={styles.rankCircleTextCenter}>1</Text>
                    </View>
                    <Text style={[styles.barText, { color: '#FFFFFF' }]}>{rankingData[0].acertos}</Text>
                    <Text style={[styles.barSubText, { color: '#FFFFFF' }]}>Acertos</Text>
                  </View>
                )}

                {/* Barra Direita (3º Lugar) */}
                {rankingData[2] && (
                  <View style={[styles.rankingBar, styles.rankingBarSide]}>
                    <View style={styles.rankCircle}>
                      <Text style={styles.rankCircleTextSide}>3</Text>
                    </View>
                    <Text style={styles.barText}>{rankingData[2].acertos}</Text>
                    <Text style={styles.barSubText}>Acertos</Text>
                  </View>
                )}
              </View>


            </>
          )}
        </View>
      </ScrollView>
      {/* Footer */}
      <Footer />

      {/* Modal de edição */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={pickImage}>
              {newPhoto ? (
                <Image source={{ uri: newPhoto }} style={styles.modalAvatar} />
              ) : (
                <View style={styles.modalAvatar}>
                  <Icon name="person" size={40} color="#004A5A" />
                </View>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={newName}
              onChangeText={setNewName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>{uploading ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Termos e Condições */}
      <Modal
        visible={termsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTermsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.termsContent}>
            <Text style={styles.modalTitle}>Termos e Condições</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.termsText}>
                Estes são os termos e condições de uso do aplicativo Vestibulize.
                Ao utilizar o app, você concorda com nossas políticas de privacidade, uso de dados e regras de conduta.
                Não compartilhe informações pessoais sensíveis. O uso indevido pode resultar em suspensão da conta.
                Para dúvidas, entre em contato com o suporte.
                {"\n\n"}
                (Nossos termos de usos são : Primeiro termo, segundo termo, terceiro termo, quarto termo, quinto termo, sexto termo, sétimo termo, oitavo termo, nono termo, décimo termo e assim por diante... )
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={() => setTermsVisible(false)}>
              <Text style={styles.saveButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
