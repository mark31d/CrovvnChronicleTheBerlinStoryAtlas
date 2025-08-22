// Components/EditLocation.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable, Image, Alert, ScrollView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { setOverride } from './spotsOverrides';

const COLORS = {
  bg:      '#FFFFFF', // фон экрана
  text:    '#0B1220', // основной текст
  muted:   '#64748B', // подписи
  field:   '#F1F5F9', // фон инпутов
  border:  '#E5E7EB', // границы/разделители
  primary: '#1E3A8A', // основной акцент (кнопки/иконки)
  accent:  '#60A5FA', // дополнительный акцент
  white:   '#FFFFFF',
};

export default function EditLocation({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const spot = route?.params?.spot || {};
  const [title, setTitle]             = useState(spot.title || '');
  const [description, setDescription] = useState(spot.description || '');
  const [categoryLabel, setCategory]  = useState(spot.categoryLabel || '');
  const [rating, setRating]           = useState(String(spot.rating ?? ''));

  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const onSave = async () => {
    if (!spot?.id) {
      Alert.alert('Edit', 'Cannot edit: spot has no id');
      return;
    }
    const patch = {
      title: (title || '').trim() || spot.title,
      description: (description || '').trim() || spot.description,
      categoryLabel: (categoryLabel || '').trim() || spot.categoryLabel,
    };
    const r = parseFloat(rating);
    if (!Number.isNaN(r)) patch.rating = r;

    const ok = await setOverride(spot.id, patch);
    if (!ok) {
      Alert.alert('Error', 'Failed to save changes');
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['top','left','right']}>
      {/* Header */}
      <View style={[styles.headerRow, { paddingHorizontal: 14 + insets.left }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn} hitSlop={10}>
          <Image source={require('../assets/back.webp')} style={[styles.headerIcon, { tintColor: COLORS.primary }]} />
        </Pressable>

        <Text style={styles.headerTitle}>Edit</Text>

        <Pressable onPress={onSave} style={[styles.headerBtn, styles.headerBtnPrimary]} hitSlop={10}>
          <Image source={require('../assets/check.webp')} style={[styles.headerIcon, { tintColor: COLORS.white }]} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          value={categoryLabel}
          onChangeText={setCategory}
          placeholder="Category"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Rating</Text>
        <TextInput
          value={rating}
          onChangeText={setRating}
          placeholder="4.5"
          keyboardType="decimal-pad"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor={COLORS.muted}
          style={[styles.input, styles.textarea]}
          multiline
        />

        <Pressable onPress={onSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const R = 20;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  headerBtnPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  headerIcon: { width: 20, height: 20, resizeMode: 'contain' },
  headerTitle: { flex: 1, textAlign: 'center', color: COLORS.text, fontSize: 22, fontWeight: '700' },

  label: { color: COLORS.text, opacity: 0.9, marginTop: 12, marginBottom: 6, fontWeight: '600' },

  input: {
    backgroundColor: COLORS.field,
    color: COLORS.text,
    borderRadius: R,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  textarea: { minHeight: 120, textAlignVertical: 'top' },

  saveBtn: {
    marginTop: 18,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#1E3A8A', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 3 },
    }),
  },
  saveText: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
});
