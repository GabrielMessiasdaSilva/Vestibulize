import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../../src/services/firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const bottomNavHeight = 80;

interface UserData {
  username: string;
  photoURL?: string;
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

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setNewName(data.username);
          setNewPhoto(data.photoURL || null);
        }

        const rankingQuery = query(
          collection(db, 'users', userId, 'ranking'),
          orderBy('acertos', 'desc'),
          limit(3)
        );
        const rankingSnapshot = await getDocs(rankingQuery);
        const ranking = rankingSnapshot.docs.map(doc => doc.data() as RankingItem);
        setRankingData(ranking);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

      await updateDoc(doc(db, 'users', userId), {
        username: newName,
        photoURL,
      });

      setUserData({ username: newName, photoURL });
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
      navigation.navigate('Inicial' as never);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta');
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

        {/* Ranking */}
        <View style={styles.rankingSection}>
          <Text style={styles.rankingTitle}>Ranking</Text>
          <Text style={styles.rankingDescription}>
            Analisamos seu desempenho e este é o ranking das suas 3 matérias com maior número de acertos.
          </Text>
          <View style={styles.rankingList}>
            {rankingData.map((item, index) => (
              <View key={index} style={styles.rankingItem}>
                <View style={styles.rankingNumber}>
                  <Text style={styles.rankingNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.rankingItemText}>{item.materia}</Text>
                <Text style={styles.rankingAcertos}>{item.acertos} acertos</Text>
              </View>
            ))}
          </View>
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
