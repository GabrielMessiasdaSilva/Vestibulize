import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { timeModal } from './styles';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path } from 'react-native-svg';

interface TimeModalProps {
  visible: boolean;
  inputTime: string; // current minutes value from parent
  setInputTime: (value: string) => void;
  onActivate: (tempo: string) => void; // parent handler (keeps existing behavior)
  onDeactivate: () => void;
  onClose: () => void;
  resetTime?: boolean;
}

const TimeModal: React.FC<TimeModalProps> = ({
  visible,
  inputTime,
  setInputTime,
  onActivate,
  onClose,
  resetTime,
}) => {
  const { t } = useTranslation();

  // Local state for minutes/seconds and which box is selected
  const [minutes, setMinutes] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('');
  const [selected, setSelected] = useState<'minutes' | 'seconds' | null>('minutes');

  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

      if (!inputTime || inputTime === 'none' || resetTime) {
        setMinutes('00');
        setSeconds('00');
      } else {
        const [m, s] = inputTime.split(':');
        setMinutes(m ? m.padStart(2, '0') : '00');
        setSeconds(s ? s.padStart(2, '0') : '00');
      }

      setSelected('minutes');

      return () => backHandler.remove();
    }
  }, [visible, inputTime, resetTime]);

  // sanitize numeric inputs: allow only digits and limit length
  const handleMinutesChange = (text: string) => {
    const num = text.replace(/[^0-9]/g, '');
    // allow up to 2 digits
    const truncated = num.slice(0, 2);
    setMinutes(truncated);
  };

  const handleSecondsChange = (text: string) => {
    const num = text.replace(/[^0-9]/g, '');
    const truncated = num.slice(0, 2);
    // seconds must be 0-59; adjust if user types >59
    if (truncated === '') {
      setSeconds('00');
    } else {
      const n = Number(truncated);
      if (n > 59) setSeconds('59');
      else setSeconds(truncated.padStart(2, '0'));
    }
  };

  const handleOk = () => {
    const m = minutes === '' ? 0 : Number(minutes);
    const s = seconds === '' ? 0 : Number(seconds);
    const totalSeconds = m * 60 + s;

    if (totalSeconds <= 0 || m > 60 || s > 59) {
      Alert.alert(
        t('timeModal.alertAtençãoTitulo') ?? 'Atenção',
        t('timeModal.alertAtençãoMensagem') ?? 'Insira um valor válido (até 60 minutos e no mínimo 1 segundo).'
      );
      return;
    }

    const tempo = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    setInputTime(tempo);

    // passe o tempo atual para o parent
    onActivate(tempo);
  };

  const handleCancel = () => {
    // simply close modal, do not change parent input
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={timeModal.overlay}>
          <View style={timeModal.modalContainer}>
            <Text style={timeModal.title}>{t('timeModal.chooseAmount') ?? 'Determine o tempo'}</Text>

            {/* Time inputs */}
            <View style={timeModal.timeRow}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setSelected('minutes')}
                style={[
                  timeModal.inputBox,
                  selected === 'minutes' ? timeModal.inputBoxSelected : {},
                ]}
              >
                <TextInput
                  value={minutes}
                  onChangeText={handleMinutesChange}
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  maxLength={2}
                  style={timeModal.inputText}
                  onFocus={() => setSelected('minutes')}
                  selectionColor="#005C6D"
                  underlineColorAndroid="transparent"
                />
              </TouchableOpacity>

              <Text style={timeModal.separator}>:</Text>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setSelected('seconds')}
                style={[
                  timeModal.inputBox,
                  selected === 'seconds' ? timeModal.inputBoxSelected : {},
                ]}
              >
                <TextInput
                  value={seconds}
                  onChangeText={handleSecondsChange}
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  maxLength={2}
                  style={timeModal.inputText}
                  onFocus={() => setSelected('seconds')}
                  selectionColor="#005C6D"
                  underlineColorAndroid="transparent"
                />
              </TouchableOpacity>
            </View>

            {/* Labels under inputs */}
            <View style={timeModal.labelRow}>
              <Text style={timeModal.label}>{t('timeModal.minutes') ?? 'Minutos'}</Text>
              <Text style={timeModal.label}>{t('timeModal.seconds') ?? 'Segundos'}</Text>
            </View>

            {/* Buttons: Cancel / OK */}
            <View style={timeModal.buttonRow}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={timeModal.cancelButton}>{t('timeModal.cancel') ?? 'Cancelar'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleOk}>
                <Text style={timeModal.okButton}>{t('timeModal.ok') ?? 'Ativar'}</Text>
              </TouchableOpacity>
            </View>

            {/* Clock SVG icon bottom-left */}
            <View style={timeModal.iconWrapper}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" style={timeModal.iconClock}>
                <Circle cx="12" cy="12" r="9" fill="#4C636A" />
                <Circle cx="12" cy="12" r="9" stroke="#4C636A" strokeWidth="1.4" />
                <Path d="M12 7v6l4 2" stroke="#ffffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TimeModal;
