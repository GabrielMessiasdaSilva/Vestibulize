import React, { useRef, useEffect } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

interface AnimatedPhaseCircleProps {
  children: React.ReactNode;
  isActive: boolean; // disponível ou concluída
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedPhaseCircle({
  children,
  isActive,
  style,
}: AnimatedPhaseCircleProps) {
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Animação de flutuação
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateYAnim, {
            toValue: -4, // sobe 4px
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 4, // desce 4px
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      translateYAnim.setValue(0); // reseta caso não esteja ativo
    }
  }, [isActive]);

  return (
    <Animated.View style={[style, { transform: [{ translateY: translateYAnim }] }]}>
      {children}
    </Animated.View>
  );
}