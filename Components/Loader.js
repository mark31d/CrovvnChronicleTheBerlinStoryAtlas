// Components/Loader.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  blueDark:  '#1E3A8A', // тёмно-синий (корона/полукруг)
  blueLight: '#60A5FA', // бледно-синий
  offWhite:  '#F7F5F1', // фон
  text:      '#13254F',
  track:     '#D6E4F9', // трек линии
};

export default function Loader({ navigation, onFinish, delay = 3000 }) {
  const { width, height } = useWindowDimensions();

  const ring = useRef(new Animated.Value(0)).current;   // пульс кольца
  const slide = useRef(new Animated.Value(0)).current;  // бегунок линии

  useEffect(() => {
    // Пульс кольца
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(ring, { toValue: 0, duration: 1100, easing: Easing.in(Easing.quad), useNativeDriver: false }),
      ])
    ).start();

    // Линия-прогресс
    Animated.loop(
      Animated.timing(slide, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: false })
    ).start();

    const t = setTimeout(() => {
      if (onFinish) onFinish();
      else navigation?.replace?.('Welcome');
    }, delay);
    return () => clearTimeout(t);
  }, [navigation, onFinish, delay, ring, slide]);

  const ringScale   = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.35] });
  const translateX  = slide.interpolate({ inputRange: [0, 1], outputRange: [-90, 250] });

  return (
    <SafeAreaView style={[styles.container, { width, height }]} edges={['top', 'left', 'right']}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />

      <View style={styles.logoWrap}>
        {/* Пульсирующее кольцо по центру лого */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />
        {/* Лого */}
        <Animated.Image
          source={require('../assets/Logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Заголовки */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text style={styles.titleTop}>CROVVN CHRONICLE</Text>
        <Text style={styles.titleBottom}>THE BERLIN STORY ATLAS</Text>
      </View>

      {/* Линия-прогресс ниже текста */}
      <View style={styles.progressTrack} accessibilityRole="progressbar" accessible>
        <Animated.View style={[styles.progressBar, { transform: [{ translateX }] }]} />
      </View>
    </SafeAreaView>
  );
}

const RING_SIZE = 168; // внешний диаметр кольца
const LOGO_SIZE = 140;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logoWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Кольцо с прозрачным центром
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: 'transparent',
    borderWidth: 8,
    borderColor: COLORS.blueLight,
    shadowColor: COLORS.blueDark,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: Platform.OS === 'android' ? 10 : 0,
  },

  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },

  titleTop: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1,
    textAlign: 'center',
  },
  titleBottom: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blueDark,
    marginTop: 4,
    letterSpacing: 1,
    textAlign: 'center',
  },

  progressTrack: {
    marginTop: 28,
    width: 240,
    height: 6,
    backgroundColor: COLORS.track,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    width: 90,
    height: 6,
    borderRadius: 3,
    // «два синего» через градиент-заливку имитируем линией из двух слоёв
    backgroundColor: COLORS.blueDark,
  },
});

