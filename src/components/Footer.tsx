import React, { useContext, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, Animated, Text } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { footer } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from "react-i18next";
import { UserContext } from '../services/userContext';

const mapScreens = ['Mapa', 'Quiz', 'Vida', 'Conquista', 'Ranking', 'Desafio'];
const homeScreens = ['Home', 'Materia'];

const Footer = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const isMapScreen = mapScreens.includes(route.name);
    const isHomeScreen = homeScreens.includes(route.name);
    const fadeAnim = useRef(new Animated.Value(isMapScreen ? 1 : 0)).current;
    const { user } = useContext(UserContext) as { user?: { photoURL?: string } };
    const { t } = useTranslation();

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    }, [isMapScreen, isHomeScreen]);

    return (
        <View style={[footer.container, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={footer.iconContainer}>
                <Animated.View style={{ opacity: fadeAnim, backgroundColor: isHomeScreen ? '#CEE7F0' : 'transparent', borderRadius: 18, paddingHorizontal: 12 }}>
                    <MaterialCommunityIcons
                        name="book-open-page-variant"
                        size={30}
                        color={isHomeScreen ? '#005C6D' : '#616161'}
                    />
                </Animated.View>
                <Text style={[footer.footerText, { color: isHomeScreen ? '#4C636A' : '#40484B' }]}>{t('footer.home')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Mapa')} style={footer.iconContainer}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <MaterialCommunityIcons
                        name="map-marker-star"
                        size={30}
                        color={isMapScreen ? '#005C6D' : '#616161'}
                    />
                </Animated.View>
                <Text style={[footer.footerText, { color: isHomeScreen ? '#4C636A' : '#40484B' }]}>{t('footer.track')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Perfil' as never)} style={footer.iconContainer}>
                <View style={footer.avatarFooterWrapper}>
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={footer.avatarFooter} />
                    ) : (
                        <MaterialCommunityIcons name="account" size={32} color="#004A5A" style={footer.avatarFooter} />
                    )}
                </View>
                <Text style={[footer.footerText, { color: isHomeScreen ? '#4C636A' : '#40484B' }]}>{t('footer.profile')}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Footer;