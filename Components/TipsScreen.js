// Components/TipsScreen.js  (Settings)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Switch,
  Share,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  bg:      '#FFFFFF',  // фон экрана
  text:    '#0B1220',  // основной текст
  muted:   '#64748B',  // плейсхолдер/вторичный
  card:    '#F1F5F9',  // карточки/ряды настроек
  input:   '#EEF2F7',  // поля ввода / неактивный трек
  border:  '#E5E7EB',  // бордеры
  primary: '#1E3A8A',  // основной синий (активные кнопки)
  accent:  '#60A5FA',  // акцент (вторичная кнопка)
  danger:  '#EF4444',  // опасные действия
  white:   '#FFFFFF',
};

const KEY_NAME   = 'profileName';
const KEY_PHOTO  = 'profilePhoto';
const KEY_NOTIF  = 'notificationsEnabled';
const KEY_SAVED  = 'saved_spots';
const KEY_STORY  = 'stories';

export default function TipsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [name, setName]     = useState('Mark');
  const [photo, setPhoto]   = useState(null);
  const [editing, setEditing] = useState(false);
  const [notif, setNotif]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [[, n], [, p], [, en]] = await AsyncStorage.multiGet([
          KEY_NAME, KEY_PHOTO, KEY_NOTIF,
        ]);
        if (n && n.trim()) setName(n.trim());
        if (p) setPhoto(p);
        if (en != null) setNotif(en === 'true');
      } catch {}
    })();
  }, []);

  const saveName = async () => {
    try {
      await AsyncStorage.setItem(KEY_NAME, name.trim() || 'User');
      setEditing(false);
    } catch {}
  };

  const toggleNotif = async (val) => {
    setNotif(val);
    try { await AsyncStorage.setItem(KEY_NOTIF, String(val)); } catch {}
  };

  const pickPhoto = async () => {
    Alert.alert(
      'Add photo',
      'Подключи image picker или переиспользуй CreateProfile.',
      [
        { text: 'Open CreateProfile', onPress: () => navigation.navigate('CreateProfile') },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: 'Story Spots on the Berlin Map — discover Berlin through stories!',
        url: 'https://example.com',
        title: 'Story Spots',
      });
    } catch {}
  };

  const openSettings = () => {
    try { Linking.openSettings(); } catch {}
  };

  const resetAll = () => {
    Alert.alert(
      'Reset all data',
      'This will remove your profile, saved places and stories.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                KEY_NAME, KEY_PHOTO, KEY_NOTIF, KEY_SAVED, KEY_STORY,
              ]);
              setName('User');
              setPhoto(null);
              setNotif(true);
              Alert.alert('Done', 'All local data has been reset.');
            } catch {}
          }
        }
      ]
    );
  };

  const openTerms = () => Linking.openURL('https://example.com/terms');

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 18,
          paddingBottom: 18 + insets.bottom,
          paddingLeft: 16 + insets.left,
          paddingRight: 16 + insets.right,
        }}
      >
        <Text style={styles.header}>Settings</Text>

        {/* avatar */}
        <View className="avatar" style={styles.avatarWrap}>
          <Image
            source={photo ? { uri: photo } : require('../assets/crown.webp')}
            style={styles.avatar}
          />
          <Pressable onPress={pickPhoto} style={styles.avatarPlus}>
            <Image source={require('../assets/plus.webp')} style={{ width: 14, height: 14, tintColor: COLORS.white }} />
          </Pressable>
        </View>

        {/* name row */}
        <View style={styles.row}>
          <TextInput
            value={name}
            onChangeText={setName}
            editable={editing}
            placeholder="User"
            placeholderTextColor={COLORS.muted}
            style={[styles.input, { opacity: editing ? 1 : 0.95 }]}
          />
          {editing ? (
            <Pressable onPress={saveName} style={[styles.roundBtn, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.roundEmoji}>✓</Text>
            </Pressable>
          ) : (
            // КНОПКА #1 изменена: используем pencil.webp + белый тинт
            <Pressable onPress={() => setEditing(true)} style={[styles.roundBtn, { backgroundColor: COLORS.accent }]}>
              <Image source={require('../assets/pencil.webp')} style={[styles.roundIcon, { tintColor: COLORS.white }]} />
            </Pressable>
          )}
        </View>

        {/* notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={notif}
            onValueChange={toggleNotif}
            trackColor={{ false: COLORS.input, true: COLORS.accent }}
            thumbColor={COLORS.white}
            ios_backgroundColor={COLORS.input}
          />
        </View>

        {/* share */}
        <Pressable onPress={shareApp} style={styles.settingRow}>
          <Text style={styles.settingText}>Share the app</Text>
          <Image source={require('../assets/share.webp')} style={[styles.trailingIcon, { tintColor: COLORS.primary }]} />
        </Pressable>

        {/* КНОПКА #2 добавлена: открытие системных настроек приложения */}
        <Pressable onPress={openSettings} style={styles.settingRow}>
          <Text style={styles.settingText}>Open app settings</Text>
          <Image source={require('../assets/user.webp')} style={[styles.trailingIcon, { tintColor: COLORS.primary }]} />
        </Pressable>

        {/* reset */}
        <Pressable onPress={resetAll} style={[styles.settingRow, { borderColor: '#FEE2E2', borderWidth: 1, backgroundColor: COLORS.white }]}>
          <Text style={[styles.settingText, { color: COLORS.danger }]}>Reset all data</Text>
          <Image source={require('../assets/trash.webp')} style={[styles.trailingIcon, { tintColor: COLORS.danger }]} />
        </Pressable>

        {/* terms */}
        <Pressable onPress={openTerms} style={styles.settingRow}>
          <Text style={styles.settingText}>Terms of Use / Privacy Policy</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const R = 24;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: { color: COLORS.primary, fontSize: 36, fontWeight: '800', marginBottom: 12 },

  avatarWrap: { alignSelf: 'center', marginTop: 8, marginBottom: 18 },
  avatar: { width: 144, height: 144, borderRadius: 72, backgroundColor: COLORS.input },
  avatarPlus: {
    position: 'absolute', right: 10, bottom: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  input: {
    flex: 1,
    height: 56,
    borderRadius: R,
    paddingHorizontal: 16,
    backgroundColor: COLORS.input,
    color: COLORS.text,
    fontSize: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roundBtn: {
    width: 56, height: 56, marginLeft: 10,
    borderRadius: 28, justifyContent: 'center', alignItems: 'center',
  },
  roundIcon: { width: 18, height: 18, resizeMode: 'contain' },
  roundEmoji: { color: COLORS.white, fontSize: 18, fontWeight: '800' },

  settingRow: {
    minHeight: 64,
    borderRadius: R,
    backgroundColor: COLORS.card,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingText: { color: COLORS.text, fontSize: 16, fontWeight: '600' },

  trailingIcon: { width: 20, height: 20, resizeMode: 'contain' },
});
