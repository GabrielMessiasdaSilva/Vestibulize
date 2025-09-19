import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import Footer from '../../components/Footer';

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
  const [newName, setNewName] = useState('');
  const [newPhoto, setNewPhoto] = useState<string | null>(null);

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
      let photoURL = userData?.photoURL || '';

      if (newPhoto && !newPhoto.startsWith('https://')) {
        // Upload da nova foto
        const response = await fetch(newPhoto);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${userId}.jpg`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      // Atualiza no Firebase Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: newName,
          photoURL,
        });
      }

      // Atualiza no Firestore
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
        {/* Cabeçalho */}
        <View style={styles.header}>
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
          <Text style={styles.name}>{userData?.username || 'Nome'}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcon name="pencil-outline" size={16} color="#004A5A" />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Opções */}
        <View style={styles.optionsCard}>
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Termos e condições</Text>
            <MaterialIcon name="arrow-top-right" size={24} color="#585858" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => auth.signOut()}
          >
            <Text style={styles.optionText}>Sair da conta</Text>
            <MaterialIcon name="logout" size={24} color="#585858" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F8F7' },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#B2EBF2', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, marginLeft: 15 },
  editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F7FA', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  editButtonText: { marginLeft: 5, color: '#004A5A', fontWeight: 'bold' },
  optionsCard: { backgroundColor: '#F0F0F0', borderRadius: 15, marginTop: 20, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  optionText: { fontSize: 16, color: '#333' },
  divider: { height: 1, backgroundColor: '#DDDDDD', marginHorizontal: 20 },
  rankingSection: { marginTop: 30 },
  rankingTitle: { fontSize: 28, fontWeight: 'bold', color: '#00839A' },
  rankingDescription: { fontSize: 15, color: '#585858', marginTop: 10, lineHeight: 22 },
  rankingList: { marginTop: 20 },
  rankingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  rankingNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#004A5A', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rankingNumberText: { color: '#fff', fontWeight: 'bold' },
  rankingItemText: { fontSize: 18, color: '#333', flex: 1 },
  rankingAcertos: { fontSize: 16, color: '#004A5A', fontWeight: 'bold' },
  bottomNav: { height: bottomNavHeight },

  // Modal
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  modalAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#B2EBF2', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 20 },
  saveButton: { backgroundColor: '#00839A', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, marginBottom: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#ccc', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  cancelButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
});
