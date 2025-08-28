import React, { useState } from "react";
import { View, Text } from 'react-native';
import { TouchableOpacity, Modal, Pressable, Image, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { Alert } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import Svg, { Circle, Line } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { timebutton } from './styles';

interface TimeButtonProps {
    selectedTime: string;
    onPress: () => void;
}

export default function TimeButton({ selectedTime, onPress }: TimeButtonProps) {
    const { t } = useTranslation();

    interface AnimatedClockProps {
        active: boolean;
        size?: number;
        color?: string;
    }

    function AnimatedClock({
        active,
        size = 40,
        color = "#619B8A",
    }: AnimatedClockProps) {
        const rotationMinutes = React.useRef(new Animated.Value(0)).current;
        const rotationHours = React.useRef(new Animated.Value(0)).current;
        const center = size / 2;
        const radius = center - 2;

        React.useEffect(() => {
            if (active) {
                // ponteiro dos minutos
                Animated.loop(
                    Animated.timing(rotationMinutes, {
                        toValue: 1,
                        duration: 10000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ).start();

                // ponteiro das horas
                Animated.loop(
                    Animated.timing(rotationHours, {
                        toValue: 1,
                        duration: 70000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ).start();
            } else {
                rotationMinutes.stopAnimation();
                rotationMinutes.setValue(0);
                rotationHours.stopAnimation();
                rotationHours.setValue(0);
            }
        }, [active]);

        // Iniciar minutos a 70° (aprox 0.199 de 360°)
        const rotateMinutesInterpolate = rotationMinutes.interpolate({
            inputRange: [0, 1],
            outputRange: ["70deg", "430deg"], // 70° inicial + 360° rotação
        });

        const rotateHoursInterpolate = rotationHours.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
        });

        return (
            <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
                {/* círculo externo */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={4}
                    fill="none"
                />
                <Animated.View
                    style={{
                        position: "absolute",
                        width: size,
                        height: size,
                        top: 0,
                        left: 0,
                        transform: [{ rotate: rotateHoursInterpolate }],
                    }}
                >
                    <Svg height={size} width={size}>
                        <Line
                            x1={center}
                            y1={center}
                            x2={center}
                            y2={center - radius * 0.5}
                            stroke={color}
                            strokeWidth={2.1}
                            strokeLinecap="round"
                        />
                    </Svg>
                </Animated.View>

                {/* ponteiro dos minutos */}
                <Animated.View
                    style={{
                        position: "absolute",
                        width: size,
                        height: size,
                        top: 0,
                        left: 0,
                        transform: [{ rotate: rotateMinutesInterpolate }],
                    }}
                >
                    <Svg height={size} width={size}>
                        <Line
                            x1={center}
                            y1={center}
                            x2={center}
                            y2={center - radius * 0.74}
                            stroke={color}
                            strokeWidth={1.5}
                            strokeLinecap="round"
                        />
                    </Svg>
                </Animated.View>

                {/* ponto central */}
                <Circle cx={center} cy={center} r={2.1} fill={color} />
            </Svg>
        );
    }

    // Estados para tooltips
    const [tooltipVisible, setTooltipVisible] = useState<
        null | "desafio" | "tempo"
    >(null);

    return (
        <View style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
            {/* Ativar Tempo */}
            <View style={{ alignItems: "center" }}>
                <View style={{ position: "relative" }}>
                    {/* Ícone ? posicionado no topo direito */}
                    <TouchableOpacity
                        onPress={() =>
                            setTooltipVisible(
                                tooltipVisible === "tempo" ? null : "tempo"
                            )
                        }
                        style={timebutton.questionMark}
                    >
                        <Icon name="question-circle" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={0.7}
                        style={timebutton.dropdownButton}
                    >
                        <AnimatedClock
                            active={selectedTime !== "none"}
                            size={40}
                            color={selectedTime !== "none" ? "#619B8A" : "#999"}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={timebutton.buttonTitle}>
                    {selectedTime !== "none"
                        ? t("map.tempoSelecionado", { tempo: selectedTime })
                        : t("map.ativarTempo")}
                </Text>
            </View>

            {/* Tooltips Modais */}
            <Modal
                transparent
                visible={tooltipVisible !== null}
                animationType="fade"
                onRequestClose={() => setTooltipVisible(null)}
            >
                <Pressable
                    style={timebutton.tooltipContainer}
                    onPress={() => setTooltipVisible(null)}
                >
                    <View style={timebutton.tooltipContent}>
                        {tooltipVisible === "tempo" && (
                            <Text style={timebutton.tooltipText}>
                                {t("map.tooltipTempo")}
                            </Text>
                        )}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}