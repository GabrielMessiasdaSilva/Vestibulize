import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import TimeModal from '../../components/TimeModal';
import TimeButton from '../../components/TimeButton';
import Footer from '../../components/Footer';

export default function Mapa() {
  const { t } = useTranslation();
  const [selectedTime, setSelectedTime] = useState("none");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTime, setInputTime] = useState("");

  const showCustomAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  const handleActivateTime = () => {
    if (inputTime && Number(inputTime) >= 1 && Number(inputTime) <= 60) {
      setSelectedTime(inputTime);
      setModalVisible(false);
      showCustomAlert(
        t("map.alertTempoAtivadoTitulo"),
        t("map.alertTempoAtivadoMensagem", { tempo: inputTime })
      );
    } else {
      showCustomAlert(
        t("map.alertAtençãoTitulo"),
        t("map.alertAtençãoMensagem")
      );
    }
  };

  const handleDeactivateTime = () => {
    setSelectedTime("none");
    setInputTime("");
    setModalVisible(false);
    showCustomAlert(
      t("map.alertTempoDesativadoTitulo"),
      t("map.alertTempoDesativadoMensagem")
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, backgroundColor: '#f7f8fa' }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('map.title')}</Text>
        <TimeButton
          selectedTime={selectedTime}
          onPress={() => setModalVisible(true)}
        />
      </ScrollView>
      <TimeModal
        visible={modalVisible}
        inputTime={inputTime}
        setInputTime={setInputTime}
        onActivate={handleActivateTime}
        onDeactivate={handleDeactivateTime}
        onClose={() => setModalVisible(false)}
      />
      <Footer />
    </View>
  );
}