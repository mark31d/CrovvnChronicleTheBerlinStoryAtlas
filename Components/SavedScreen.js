// Components/SavedScreen.js
import React, { useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground, FlatList, Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSaved } from '../Components/SavedContext';
import { SPOTS } from '../Components/spotsData'; // проверь путь

const COLORS = {
  bg:      '#FFFFFF',
  text:    '#0B1220',
  muted:   '#64748B',
  card:    '#F1F5F9',
  border:  '#E5E7EB',
  primary: '#1E3A8A',
  accent:  '#60A5FA',
  white:   '#FFFFFF',
};

export default function SavedScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = React.useState('User');
  const [avatar, setAvatar]     = React.useState(null);

  const { savedMap, toggle, refreshSaved } = useSaved();

  React.useEffect(() => {
    (async () => {
      const [[, name], [, photo]] = await AsyncStorage.multiGet(['profileName', 'profilePhoto']);
      if (name && name.trim()) setUsername(name.trim());
      if (photo) setAvatar(photo);
    })();
  }, []);

  useFocusEffect(useCallback(() => { refreshSaved(); }, [refreshSaved]));

  const data = useMemo(() => SPOTS.filter(s => savedMap[s.id]), [savedMap]);

  const openDetails = (item) => navigation.navigate('LocationDetails', { item });

  // Пустое состояние
  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top','left','right']}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: 16 + insets.left }]}>
          <Image
            source={avatar ? { uri: avatar } : require('../assets/crown.webp')}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.helloMuted}>Welcome back,</Text>
            <Text style={styles.hello}>{username || 'User'}!</Text>
          </View>
          <Text accessibilityRole="image" accessibilityLabel="waving hand" style={styles.brandEmoji}>👋</Text>
        </View>

        <Text style={[styles.title, { paddingHorizontal: 16 + insets.left }]}>Your Mark on the Map</Text>

        <View style={[styles.emptyWrap, { paddingHorizontal: 16 + insets.left, paddingBottom: insets.bottom + 12 }]}>
          <Image source={require('../assets/crown.webp')} style={{ width: 76, height: 76, tintColor: COLORS.primary, marginBottom: 18 }} />
          <Text style={styles.emptyText}>You haven’t saved any locations yet</Text>

          <Pressable onPress={() => navigation.navigate('Locations')} style={styles.exploreBtn}>
            <Text style={styles.exploreText}>Explore</Text>
            <Image source={require('../assets/chevrons.webp')} style={styles.exploreIcon} />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Список сохранённых
  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <View style={[styles.header, { paddingHorizontal: 16 + insets.left }]}>
        <Image
          source={avatar ? { uri: avatar } : require('../assets/crown.webp')}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.helloMuted}>Welcome back,</Text>
          <Text style={styles.hello}>{username || 'User'}!</Text>
        </View>
        <Text accessibilityRole="image" accessibilityLabel="waving hand" style={styles.brandEmoji}>👋</Text>
      </View>

      <Text style={[styles.title, { paddingHorizontal: 16 + insets.left }]}>Your Mark on the Map</Text>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 28 + insets.bottom,
          paddingLeft: 16 + insets.left,
          paddingRight: 16 + insets.right,
        }}
        renderItem={({ item }) => {
          const isSaved = !!savedMap[item.id];
          return (
            <View style={styles.cardWrap}>
              <ImageBackground source={item.image} style={styles.cardImage} imageStyle={styles.cardImageRadius}>
                {/* верхний ряд */}
                <View style={styles.cardTopRow}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingStar}>⭐</Text>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>

                  <Pressable onPress={() => toggle(item.id)} style={styles.bookmarkBtn} hitSlop={8}>
                    <Image
                      source={require('../assets/crown.webp')}
                      style={[
                        styles.bookmarkIcon,
                        { tintColor: isSaved ? COLORS.accent : COLORS.white, opacity: isSaved ? 1 : 0.95 },
                      ]}
                    />
                  </Pressable>
                </View>

                {/* низ карточки */}
                <View style={styles.cardBottom}>
                  <Text style={styles.cardCategory}>{item.categoryLabel}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>

                {/* кнопка перехода */}
                <Pressable onPress={() => openDetails(item)} style={styles.goBtn}>
                  <Image source={require('../assets/chevrons.webp')} style={[styles.goIcon, { tintColor: COLORS.white }]} />
                </Pressable>

                {/* затемнение */}
                <View style={styles.cardOverlay} />
              </ImageBackground>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: { paddingTop: 10, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  brandEmoji: { fontSize: 22, marginLeft: 12, includeFontPadding: false },

  helloMuted: { color: COLORS.muted, fontSize: 14 },
  hello: { color: COLORS.text, fontSize: 24, fontWeight: '700' },

  title: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginTop: 14 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 16, marginBottom: 14, textAlign: 'center' },

  exploreBtn: {
    marginTop: 8, height: 56, paddingHorizontal: 22, borderRadius: 28,
    backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  exploreText: { color: COLORS.white, fontSize: 18, fontWeight: '800', marginRight: 8 },
  exploreIcon: { width: 20, height: 20, tintColor: COLORS.white, resizeMode: 'contain' },

  // Карточки
  cardWrap: { marginTop: 14 },
  cardImage: { height: 240, borderRadius: 20, overflow: 'hidden' },
  cardImageRadius: { borderRadius: 20 },

  cardTopRow: {
    position: 'absolute', top: 12, left: 12, right: 12, zIndex: 2,
    flexDirection: 'row', justifyContent: 'space-between',
  },

  // Чуть тёмный бейдж на изображении + белая рамка
  ratingBadge: {
    paddingVertical: 10, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, borderRadius: 25,
    backgroundColor: 'rgba(11,18,32,0.45)',
    borderColor: COLORS.white, borderWidth: 1,
  },
  ratingStar: { fontSize: 14, marginRight: 6, color: COLORS.white },
  ratingText: { color: COLORS.white, fontWeight: '700' },

  bookmarkBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(11,18,32,0.45)',
    justifyContent: 'center', alignItems: 'center',
    borderColor: COLORS.white, borderWidth: 1,
  },
  bookmarkIcon: { width: 40, height: 40, resizeMode: 'contain' },

  cardBottom: { position: 'absolute', left: 16, right: 90, bottom: 20, zIndex: 2 },
  cardCategory: { color: COLORS.white, opacity: 0.95, marginBottom: 6, fontSize: 13, fontWeight: '600' },
  cardTitle: { color: COLORS.white, fontSize: 24, fontWeight: '800' },

  goBtn: {
    position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', zIndex: 2,
    borderWidth: 1, borderColor: COLORS.border,
  },
  goIcon: { width: 22, height: 22, resizeMode: 'contain' },

  // затемнение, чтобы текст читался на светлой теме
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
});
