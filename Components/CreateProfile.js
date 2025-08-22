// Components/CreateProfile.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const COLORS = {
  primary: '#1E3A8A',   // глубoкo-синий (blueDark)
  accent:  '#60A5FA',   // светлый синий (blueLight)
  gray:    '#1F2937',   // slate-800
  card:    '#0B1220',   // тёмная карточка
  black:   '#000000',
  white:   '#FFFFFF',
};

export default function CreateProfile({ navigation }) {
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);

  const pickImage = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    if (!res.didCancel && res?.assets?.[0]?.uri) {
      setPhotoUri(res.assets[0].uri);
    }
  };

  const onSkip = async () => {
    await AsyncStorage.multiSet([['profileName', ''], ['profilePhoto', '']]);
    navigation.replace('MainTabs');
  };

  const onStart = async () => {
    await AsyncStorage.multiSet([
      ['profileName', name.trim()],
      ['profilePhoto', photoUri ?? ''],
    ]);
    navigation.replace('MainTabs');
  };

  const canStart = name.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* SKIP */}
      <Pressable onPress={onSkip} style={styles.skipBtn} hitSlop={8}>
        <Text style={styles.skipText}>SKIP</Text>
      </Pressable>

      {/* Заголовок */}
      <Text style={styles.title}>Your Story Starts with{'\n'}a Name</Text>

      {/* Аватар */}
      <Pressable onPress={pickImage} style={styles.avatarWrap}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
        <View style={styles.plusBadge}>
          <Text style={styles.plusText}>＋</Text>
        </View>
      </Pressable>

      {/* Поле никнейма */}
      <View style={styles.inputWrap}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nickname"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          returnKeyType="done"
          autoCapitalize="words"
        />
      </View>

      {/* Кнопка старт */}
      <Pressable
        onPress={onStart}
        disabled={!canStart}
        style={({ pressed }) => [
          styles.cta,
          { opacity: canStart ? (pressed ? 0.9 : 1) : 0.5 },
        ]}
      >
        <Text style={styles.ctaText}>Get Started  »</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  skipBtn: { alignSelf: 'flex-start', marginTop: 12, marginBottom: 8 },
  skipText: { color: COLORS.accent, opacity: 0.95, fontSize: 14, letterSpacing: 1 },

  title: {
    color: COLORS.accent,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 36,
    marginTop: 8,
    marginBottom: 28,
  },

  avatarWrap: { alignSelf: 'center', marginBottom: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: { backgroundColor: COLORS.primary },
  plusBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: { color: COLORS.black, fontSize: 20, fontWeight: '700' },

  inputWrap: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  input: {
    color: COLORS.white,
    fontSize: 16,
  },

  cta: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
});
