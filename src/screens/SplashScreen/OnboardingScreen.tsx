import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './OnboardingStyles';

type OnboardingScreenProps = StackScreenProps<RootStackParamList, 'Onboarding'>;

const { height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.6;

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
  ) => {
    if (showFinishButton) {
      return (
        <View key={index} style={styles.slide}>
          <ImageBackground source={imageSource} style={styles.image} resizeMode="cover">
            <Image source={require('../../../assets/img/logoCPS.png')} style={styles.logo} />
          </ImageBackground>

          <View style={styles.content}>
            <Text style={styles.slideTitle}>{title}</Text>
            <Text style={styles.slideDescription}>{description}</Text>

            <View style={styles.finalContent}>
              <TouchableOpacity
                style={[styles.buttonBase, styles.playButton]}
                onPress={handleFinishOnboarding}
              >
                <Text style={styles.playButtonText}>{t('play')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View key={index} style={styles.slide}>
        <ImageBackground source={imageSource} style={styles.image} resizeMode="cover">
          <Image source={require('../../../assets/img/logoCPS.png')} style={styles.logo} />
        </ImageBackground>

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

            {index < 2 && (
              <TouchableOpacity
                style={[styles.buttonBase, styles.arrowButton]}
                onPress={() => swiperRef.current?.scrollBy(1)}
              >
                <Icon name="arrow-forward" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

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
