import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { greenModal } from './styles';
import { useTranslation } from "react-i18next";

interface GreenModalProps {
    visible: boolean;
    onContinue: () => void;
}

const GreenModal: React.FC<GreenModalProps> = ({ visible, onContinue }) => {
    const { t } = useTranslation();
    const slideAnim = useRef(new Animated.Value(200)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: 200,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => onContinue());
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                greenModal.container,
                { transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={greenModal.content}>
                <Text style={greenModal.text}>{t("quiz.correctAnswer")}</Text>
            </View>
        </Animated.View>
    );
};

export default GreenModal;