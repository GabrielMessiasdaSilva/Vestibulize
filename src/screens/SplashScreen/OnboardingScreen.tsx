// onboardingScreen.tsx

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingScreenProps = StackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const swiperRef = useRef<Swiper>(null);
  const { t } = useTranslation();
  
  const handleFinishOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('Inicial');
  };

  const renderSlide = (
    imageSource: any,
    title: string,
    description: string,
    index: number,
    showFinishButton: boolean = false
  ) => (
    <ImageBackground source={imageSource} style={styles.slideImage} resizeMode="cover">
      <Image source={require('../../../assets/img/logoCPS.png')} style={styles.logo} />

      <View style={styles.content}>
        <Text style={styles.slideTitle}>{title}</Text>
        <Text style={styles.slideDescription}>{description}</Text>

        <View style={styles.actions}>
          {index > 0 && (
            <TouchableOpacity
              style={[styles.buttonBase, styles.backButton]}
              onPress={() => swiperRef.current?.scrollBy(-1)}
            >
              <Text style={styles.backButtonText}>{t('voltar')}</Text>
            </TouchableOpacity>
          )}

          {!showFinishButton && index < 2 && (
            <TouchableOpacity
              style={[styles.buttonBase, styles.arrowButton]}
              onPress={() => swiperRef.current?.scrollBy(1)}
            >
              <Icon name="arrow-forward" size={28} color="#fff" />
            </TouchableOpacity>
          )}

          {showFinishButton && (
            <TouchableOpacity
              style={[styles.buttonBase, styles.playButton]}
              onPress={handleFinishOnboarding}
            >
              <Text style={styles.playButtonText}>{t('play')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );

  const slides = [
    {
      image: require('../../../assets/img/ImgSplash1.png'),
      title: t('slide1.title'),
      description: t('slide1.description'),
    },
    {
      image: require('../../../assets/img/imgSplash2.png'),
      title: t('slide2.title'),
      description: t('slide2.description'),
    },
    {
      image: require('../../../assets/img/imgSplash3.png'),
      title: t('slide3.title'),
      description: t('slide3.description'),
      showFinishButton: true,
    },
  ];

  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      showsPagination
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      paginationStyle={styles.pagination}
    >
      {slides.map((slide, idx) =>
        renderSlide(slide.image, slide.title, slide.description, idx, slide.showFinishButton)
      )}
    </Swiper>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  slideImage: {
    flex: 1,
    width: '100%',
    height:'60%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    marginTop: 50,
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 120,
    width: '100%',
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1B',
    textAlign: 'center',
    marginBottom: 10,
  },
  slideDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    fontWeight: '400',
    color: '#004854',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonBase: {
    borderRadius: 20,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#004854',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  arrowButton: {
    backgroundColor: '#004854',
    padding: 16,
    borderRadius: 30,
  },
  backButtonText: {
    color: '#004854',
    fontSize: 16,
  },
  playButton: {
    paddingVertical: 20,
    paddingHorizontal: 60,
    backgroundColor: '#004854',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dot: {
    backgroundColor: '#D9D9D9',
    width: 8,
    height: 8,
    borderRadius: 50,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#B20000',
    width: 10,
    height: 10,
    borderRadius: 50,
    marginHorizontal: 4,
  },
  pagination: {
    bottom: 340,
  },
});
