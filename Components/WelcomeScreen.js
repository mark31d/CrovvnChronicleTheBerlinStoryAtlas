// Components/WelcomeScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Image, Animated, PanResponder, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_W } = Dimensions.get('window');

const COLORS = {
  blueDark:  '#1E3A8A',
  blueLight: '#60A5FA',
  white:     '#FFFFFF',
  black:     '#000000',
};

const KNOB = 60;
const H_MARGINS = 40; // 20 + 20 отступы контейнера

export default function WelcomeScreen({ navigation }) {
  const [slideX]  = useState(new Animated.Value(0));
  const [trackW, setTrackW] = useState(SCREEN_W - H_MARGINS);
  const endX = Math.max(0, trackW - KNOB);

  // ОПАСИТИ ДЛЯ ТЕКСТА НА ТАБЛЕТКЕ (а не сверху)
  const pillTextOpacity = useMemo(
    () =>
      slideX.interpolate({
        inputRange: [0, endX * 0.3, endX * 0.7, endX],
        outputRange: [1, 0.7, 0.25, 0],
        extrapolate: 'clamp',
      }),
    [endX, slideX]
  );

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 2,
        onPanResponderMove: (_, g) => {
          const x = clamp(g.dx, 0, endX);
          slideX.setValue(x);
        },
        onPanResponderRelease: (_, g) => {
          const shouldFinish = g.vx > 0.8 || g.dx > endX * 0.55;

          if (shouldFinish) {
            Animated.spring(slideX, {
              toValue: endX,
              velocity: Math.max(1.2, g.vx),
              mass: 0.6,
              stiffness: 220,
              damping: 24,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) navigation.replace('CreateProfile');
            });
          } else {
            Animated.spring(slideX, {
              toValue: 0,
              velocity: Math.abs(g.vx),
              mass: 0.7,
              stiffness: 180,
              damping: 22,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [endX, navigation, slideX]
  );

  return (
    <View style={styles.container}>
      {/* верхняя часть с картинкой */}
      <View style={styles.topWrap}>
        <Image
          source={require('../assets/welcome_collage.webp')}
          style={styles.topImage}
          resizeMode="cover"
        />
        <LinearGradient
          pointerEvents="none"
          colors={['#000000', '#0A0A0A', '#FFFFFF']}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.topGradient}
        />
      </View>

      {/* нижняя часть — белый фон с контентом */}
      <View style={styles.bottomWrap}>
        <View style={styles.content}>
          <Image source={require('../assets/Logo.webp')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>CROVVN STORY SPOTS</Text>
          <Text style={styles.subtitle}>ON THE BERLIN MAP</Text>

          <Text style={styles.headline}>Discover Berlin Through Stories</Text>
          <Text style={styles.desc}>
            Every street, bridge, and café has something to say. Explore the city’s
            iconic spots — and share the moments that mattered to you.
          </Text>
        </View>

        {/* свайп-кнопка */}
        <View
          style={styles.sliderContainer}
          onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
        >
          {/* «кнопка»-ползунок */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.slider, { transform: [{ translateX: slideX }] }]}
          >
            <Text style={styles.arrow}>{'»'}</Text>
          </Animated.View>

          {/* центральный текст таблетки — исчезает при свайпе */}
          <Animated.View style={styles.sliderTextWrap} pointerEvents="none">
            <Animated.Text style={[styles.sliderText, { opacity: pillTextOpacity }]}>
              Slide to Start Exploring
            </Animated.Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topWrap: { backgroundColor: COLORS.black, width: '100%', height: '45%' },
  topImage: { width: '100%', height: '100%' },
  topGradient: {
    position: 'absolute', left: 0, right: 0, bottom: -1,
    height: Math.round(SCREEN_W * 0.03), zIndex: 2,
  },

  bottomWrap: { flex: 1, backgroundColor: COLORS.white },

  content: { padding: 20, alignItems: 'center' },
  logo: { width: 70, height: 70, marginBottom: 12 },

  title: { fontSize: 26, fontWeight: '700', color: COLORS.blueDark },
  subtitle: { fontSize: 14, color: COLORS.blueLight, marginBottom: 20 },

  headline: { fontSize: 20, color: COLORS.blueDark, textAlign: 'center', marginBottom: 10 },
  desc: { fontSize: 14, color: COLORS.blueLight, textAlign: 'center' },

  sliderContainer: {
    height: 60, marginHorizontal: 20, marginBottom: 40,
    borderRadius: 30, backgroundColor: COLORS.blueLight,
    justifyContent: 'center', overflow: 'hidden',
  },
  slider: {
    position: 'absolute', left: 0, width: KNOB, height: KNOB, borderRadius: KNOB / 2,
    backgroundColor: COLORS.blueDark, justifyContent: 'center', alignItems: 'center',
    zIndex: 3,
  },
  arrow: { fontSize: 26, color: COLORS.white },

  sliderTextWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderText: { fontSize: 16, color: COLORS.white },
});
