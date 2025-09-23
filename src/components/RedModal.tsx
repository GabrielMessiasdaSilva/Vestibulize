import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { redModal } from './styles';
import { useTranslation } from 'react-i18next';

interface RedModalProps {
    visible: boolean;
    onContinue: () => void;
}

const RedModal: React.FC<RedModalProps> = ({
    visible,
    onContinue
}) => {
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
                redModal.container,
                { transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={redModal.content}>
                <Text style={redModal.text}>{t("quiz.wrongAnswer")}</Text>
            </View>
        </Animated.View>
    );
};

export default RedModal;