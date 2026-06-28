import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator, RefreshControl, Share, Image,
  Modal, TextInput, ImageBackground, useWindowDimensions, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import AnimatedCard from '../../components/AnimatedCard';

export default function AkunScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const stickyBarOpacity = scrollY.interpolate({
    inputRange: [50, 110],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const savedAvatar = await AsyncStorage.getItem('@vip_avatar_url');
    const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (data?.user) {
      setEmail(data.user.email || '');
      setAvatarUrl(savedAvatar !== null ? savedAvatar : (data.user.user_metadata?.avatar_url || ''));
      setFullName(data.user.user_metadata?.full_name || '');
      setPhone(data.user.user_metadata?.phone || '');
    } else {
      if (savedAvatar) setAvatarUrl(savedAvatar);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  };

  const handleSelectAvatar = async (selectedUrl: string) => {
    setUpdatingAvatar(true);
    try {
      // Save locally to AsyncStorage so it works instantly regardless of auth state
      await AsyncStorage.setItem('@vip_avatar_url', selectedUrl);
      setAvatarUrl(selectedUrl);
      setSheetVisible(false);
      Alert.alert('Berhasil', selectedUrl ? 'Foto profil berhasil diperbarui!' : 'Foto profil dihapus');

      // Try syncing with Supabase backend silently
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        await supabase.auth.updateUser({
          data: { avatar_url: selectedUrl },
        });
      }
    } catch (e) {
      // Ignore network or unauthenticated Supabase errors since local save succeeded
    }
    setUpdatingAvatar(false);
  };

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      return Alert.alert('Izin Ditolak', 'Dibutuhkan izin untuk membuka galeri foto HP Anda.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      handleSelectAvatar(result.assets[0].uri);
    }
  };

  const takeFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      return Alert.alert('Izin Ditolak', 'Dibutuhkan izin untuk membuka kamera HP Anda.');
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      handleSelectAvatar(result.assets[0].uri);
    }
  };

  const handleAvatarPress = () => {
    setSheetVisible(true);
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

      {/* Sticky Animated Glass Top Bar */}
      <Animated.View style={[styles.stickyBar, { opacity: stickyBarOpacity }]}>
        <ImageBackground source={require('../../assets/logo.jpg')} style={styles.stickyBarBg}>
          <View style={styles.stickyBarOverlay} />
          <SafeAreaView edges={['top']} style={styles.stickyBarContent}>
            <View style={styles.stickyTitleRow}>
              <Text style={styles.stickyBarTitle}>Profil</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ef4444" colors={['#ef4444']} />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Animated Hero Red Burgundy Glass Header */}
        <Animated.View style={[styles.headerWrap, { transform: [{ translateY: headerTranslateY }] }]}>
          <ImageBackground source={require('../../assets/logo.jpg')} style={styles.headerBg} imageStyle={styles.headerBgImg}>
            <View style={styles.headerOverlay} />
            <SafeAreaView edges={['top']} style={{ paddingBottom: 22 }}>
              <View style={[styles.headerHeroTextWrap, isSmall && { paddingHorizontal: 16, paddingBottom: 12 }]}>
                <Text style={styles.locSubtitle}>MEMBER VIP RESMI</Text>
                <Text style={styles.heroBigTitle}>Profil Eksekutif</Text>
                <Text style={styles.heroSubText}>Kelola hak akses VIP, preferensi perjalanan & verifikasi akun Anda</Text>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </Animated.View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#dc2626" />
          </View>
        ) : (
          <View style={styles.content}>
            {/* Profile Card */}
            <AnimatedCard delay={100} style={styles.profileCard}>
              <View style={styles.profileRow}>
                <TouchableOpacity style={styles.avatarWrap} activeOpacity={0.8} onPress={handleAvatarPress}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={28} color="#f1f5f9" />
                  )}
                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={11} color="#ffffff" />
                  </View>
                </TouchableOpacity>

                <View style={styles.profileInfo}>
                  <Text style={styles.fullName} numberOfLines={1}>
                    {fullName || (email ? email.split('@')[0] : 'Member VIP')}
                  </Text>
                  <Text style={styles.email} numberOfLines={1}>{email || 'vibecoden@gmail.com'}</Text>

                  <View style={styles.phoneRow}>
                    <Ionicons name="call-outline" size={13} color="#94a3b8" />
                    <Text style={styles.phoneText}>{phone || '0812-xxxx-xxxx (Belum diatur)'}</Text>
                  </View>

                  <View style={styles.badgeRow}>
                    <View style={styles.badgeDot} />
                    <Text style={styles.badgeText}>Terverifikasi • Member VIP</Text>
                  </View>
                </View>
              </View>
            </AnimatedCard>

            {/* Menu Umum */}
            <AnimatedCard delay={200} style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/profile')}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}><Ionicons name="person-outline" size={20} color="#60a5fa" /></View>
                  <Text style={styles.menuText}>Edit Profil</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/history')}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}><Ionicons name="receipt-outline" size={20} color="#f59e0b" /></View>
                  <Text style={styles.menuText}>Riwayat Pemesanan</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>
            </AnimatedCard>

            {/* Menu Lainnya */}
            <AnimatedCard delay={300} style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/verify')}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}><Ionicons name="shield-checkmark-outline" size={20} color="#4ade80" /></View>
                  <Text style={styles.menuText}>Verifikasi Akun</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={async () => {
                  try {
                    await Share.share({
                      message: 'Sewa mobil terpercaya di Jawa Barat — Car Auto Retail!\n\nDownload sekarang: https://carautoretail.app',
                    });
                  } catch { }
                }}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}><Ionicons name="share-outline" size={20} color="#38bdf8" /></View>
                  <Text style={styles.menuText}>Bagikan Aplikasi</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/rating')}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}><Ionicons name="star-outline" size={20} color="#fcd34d" /></View>
                  <Text style={styles.menuText}>Beri Rating</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/(tabs)/contact')}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}><Ionicons name="call-outline" size={20} color="#38bdf8" /></View>
                  <Text style={styles.menuText}>Hubungi Kami</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/(tabs)/faq')}>
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}><Ionicons name="information-circle-outline" size={20} color="#a78bfa" /></View>
                  <Text style={styles.menuText}>Info & FAQ</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>
            </AnimatedCard>

            {/* Logout */}
            <AnimatedCard delay={400}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                <Text style={styles.logoutText}>Keluar</Text>
              </TouchableOpacity>
            </AnimatedCard>

            {/* Info Text */}
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark" size={14} color="#fcd34d" />
              <Text style={styles.infoText}>Data Anda aman dan terenkripsi</Text>
            </View>

            {/* Footer */}
            <Text style={styles.footerText}>Car Auto Retail Jawa Barat v1.0</Text>
          </View>
        )}
      </Animated.ScrollView>

      {/* Sleek Action Sheet Modal */}
      {sheetVisible && (
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setSheetVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetHeader}>Foto Profil</Text>

            <TouchableOpacity style={styles.sheetItem} onPress={() => { setSheetVisible(false); setTimeout(takeFromCamera, 200); }} activeOpacity={0.7}>
              <Ionicons name="camera-outline" size={20} color="#f1f5f9" style={styles.sheetItemIcon} />
              <Text style={styles.sheetItemText}>Ambil Foto dari Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetItem} onPress={() => { setSheetVisible(false); setTimeout(pickFromGallery, 200); }} activeOpacity={0.7}>
              <Ionicons name="images-outline" size={20} color="#f1f5f9" style={styles.sheetItemIcon} />
              <Text style={styles.sheetItemText}>Pilih dari Galeri HP</Text>
            </TouchableOpacity>

            {avatarUrl ? (
              <TouchableOpacity style={[styles.sheetItem, { borderBottomWidth: 0 }]} onPress={() => { setSheetVisible(false); handleSelectAvatar(''); }} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" style={styles.sheetItemIcon} />
                <Text style={[styles.sheetItemText, { color: '#ef4444' }]}>Hapus Foto Profil</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={styles.sheetCancel} onPress={() => setSheetVisible(false)} activeOpacity={0.8}>
              <Text style={styles.sheetCancelText}>Batal</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  stickyBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0f1e',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  stickyBarBg: {
    width: '100%',
  },
  stickyBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.88)',
  },
  stickyBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  stickyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyBarTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '900',
  },
  headerWrap: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#0a0f1e',
    marginBottom: 20,
  },
  loadingWrap: { alignItems: 'center', justifyContent: 'center', padding: 60 },
  headerBg: {
    width: '100%',
    paddingTop: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  headerBgImg: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0f1e',
  },
  headerHeroTextWrap: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-start',
  },
  locSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroBigTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  heroSubText: {
    fontSize: 12,
    color: '#f8fafc',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  content: { paddingHorizontal: 20, paddingTop: 10 },

  profileCard: {
    backgroundColor: '#1e293b', borderRadius: 20,
    borderWidth: 1, borderColor: '#334155', padding: 20, marginBottom: 24,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrap: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: '#334155',
    borderWidth: 2, borderColor: '#16a34a', alignItems: 'center', justifyContent: 'center',
  },
  avatarImage: { width: 64, height: 64, borderRadius: 32 },
  cameraBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 12, backgroundColor: '#16a34a',
    borderWidth: 2, borderColor: '#1e293b', alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  fullName: { fontSize: 17, fontWeight: '800', color: '#f1f5f9', marginBottom: 2 },
  email: { fontSize: 13, color: '#94a3b8', marginBottom: 6 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  phoneText: { fontSize: 12, color: '#cbd5e1', fontWeight: '600' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16a34a' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#4ade80' },

  menuCard: {
    backgroundColor: '#1e293b', borderRadius: 16,
    borderWidth: 1, borderColor: '#334155', marginBottom: 24, overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIconWrap: { width: 32, alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 14, fontWeight: '600', color: '#f1f5f9' },
  menuDivider: { height: 1, backgroundColor: '#334155', marginHorizontal: 20 },

  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 20, marginBottom: 20 },
  infoText: { fontSize: 12, color: '#cbd5e1', fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', paddingVertical: 14,
  },
  logoutText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  footerText: { textAlign: 'center', color: '#334155', fontSize: 11, fontWeight: '600', marginBottom: 20 },



  // Action Sheet
  sheetOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#1e293b', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingBottom: 32 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', alignSelf: 'center', marginTop: 12, marginBottom: 20 },
  sheetHeader: { fontSize: 16, fontWeight: '800', color: '#cbd5e1', textAlign: 'center', marginBottom: 20, letterSpacing: 0.3 },
  sheetItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  sheetItemIcon: { marginRight: 16 },
  sheetItemText: { fontSize: 15, fontWeight: '600', color: '#f1f5f9' },
  sheetCancel: { backgroundColor: '#334155', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  sheetCancelText: { fontSize: 15, fontWeight: '800', color: '#f1f5f9' },
});
