// FatecCard.tsx
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fatecCard } from "./styles";

type FatecCardProps = {
  name: string;
  vicinity: string;
  distance: string;
  duration: string;
  onPress?: () => void;
};

export default function FatecCard({ name, vicinity, distance, duration, onPress }: FatecCardProps) {
  return (
    <View style={fatecCard.card}>
      <View style={fatecCard.cardHeader}>
        <View style={fatecCard.cardHeaderLeft}>
          <MaterialCommunityIcons name="clock-outline" size={35} color="#005C6D" />
          <Text style={fatecCard.durationText}>{duration}</Text>
        </View>

        <View style={fatecCard.badge}>
          <Text style={fatecCard.badgeText}>{distance}</Text>
        </View>
      </View>

      <Text style={fatecCard.locationName}>{name}</Text>
      <Text style={{ marginTop: 4, color: "#4A4459" }}>{vicinity}</Text>

      <View style={fatecCard.buttonContainer}>
        <View style={fatecCard.knowMoreButton}>
          <Text style={fatecCard.knowMoreText} onPress={onPress}>
            Saiba mais
          </Text>
        </View>
      </View>
    </View>
  );
}