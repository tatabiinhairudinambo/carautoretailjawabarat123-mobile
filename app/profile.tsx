import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sheetOptions, setSheetOptions] = useState<{ label: string; icon: 'camera-outline' | 'images-outline' | 'trash-outline'; onPress: () => void; color: string }[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedAvatar = await AsyncStorage.getItem('@vip_avatar_url');
    const savedName = await AsyncStorage.getItem('@vip_full_name');
    const savedPhone = await AsyncStorage.getItem('@vip_phone');

    const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (data?.user) {
      setEmail(data.user.email || 'vibecoden@gmail.com');
      setFullName(savedName !== null ? savedName : (data.user.user_metadata?.full_name || ''));
      setPhone(savedPhone !== null ? savedPhone : (data.user.user_metadata?.phone || ''));
      setAvatarUrl(savedAvatar !== null ? savedAvatar : (data.user.user_metadata?.avatar_url || ''));
    } else {
      setEmail('vibecoden@gmail.com');
      if (savedName) setFullName(savedName);
      if (savedPhone) setPhone(savedPhone);
      if (savedAvatar) setAvatarUrl(savedAvatar);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      router.back();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      router.back();
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    const options = [
      { label: 'Ambil Foto', icon: 'camera-outline' as const, onPress: takePhoto, color: '#f1f5f9' as const },
      { label: 'Pilih dari Galeri', icon: 'images-outline' as const, onPress: pickImage, color: '#f1f5f9' as const },
      { label: 'Hapus Foto', icon: 'trash-outline' as const, onPress: async () => { await AsyncStorage.removeItem('@vip_avatar_url'); setAvatarUrl(''); }, color: '#ef4444' as const },
    ];
    setSheetVisible(true);
    setSheetOptions(options);
  };

  const uploadAvatar = async (uri: string) => {
    setUploading(true);
    try {
      // Save local device URI immediately to AsyncStorage
      await AsyncStorage.setItem('@vip_avatar_url', uri);
      setAvatarUrl(uri);

      const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
      const user = data?.user;
      if (!user) return; // If unauthenticated, stop silently since local save succeeded

      const ext = uri.split('.').pop() || 'jpg';
      const fileName = `avatar_${user.id}_${Date.now()}.${ext}`;
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, arrayBuffer, {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        if (publicUrl) {
          await AsyncStorage.setItem('@vip_avatar_url', publicUrl);
          setAvatarUrl(publicUrl);
        }
      }
    } catch (err) {
      // Ignore background upload error
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Peringatan', 'Nama lengkap harus diisi');
      return;
    }
    setSaving(true);
    await AsyncStorage.setItem('@vip_full_name', fullName.trim());
    await AsyncStorage.setItem('@vip_phone', phone.trim());
    if (avatarUrl) await AsyncStorage.setItem('@vip_avatar_url', avatarUrl);

    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        await supabase.auth.updateUser({
          data: { full_name: fullName.trim(), phone: phone.trim(), avatar_url: avatarUrl },
        });
      }
    } catch {}

    setSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.back();
    }, 2000);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#dc2626" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profil</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={showImagePicker} activeOpacity={0.8} disabled={uploading}>
            <View style={styles.avatarWrap}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Ionicons name="person" size={40} color="#f1f5f9" />
                </View>
              )}
              <View style={styles.avatarBadge}>
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="camera" size={12} color="#fff" />
                )}
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Ketuk untuk mengganti foto</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Budi Santoso"
              placeholderTextColor="#475569"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 081234567890"
              placeholderTextColor="#475569"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputDisabled}>
              <Text style={styles.inputDisabledText}>{email}</Text>
            </View>
            <Text style={styles.inputHint}>Email tidak dapat diubah</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.saveText}>Simpan Perubahan</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Action Sheet */}
      {sheetVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSheetVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Foto Profil</Text>
            {sheetOptions.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.sheetItem, i === sheetOptions.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => { setSheetVisible(false); setTimeout(opt.onPress, 200); }}
                activeOpacity={0.7}
              >
                <Ionicons name={opt.icon} size={20} color={opt.color} style={styles.sheetItemIcon} />
                <Text style={[styles.sheetItemText, { color: opt.color }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.sheetCancel} onPress={() => setSheetVisible(false)} activeOpacity={0.8}>
              <Text style={styles.sheetCancelText}>Batal</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="auto">
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <View style={{
              backgroundColor: '#0a0f1e',
              padding: 24,
              borderRadius: 24,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#1e293b',
              width: 280,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.8,
              shadowRadius: 20,
              elevation: 15,
            }}>
              <View style={{
                width: 64, height: 64, borderRadius: 32,
                backgroundColor: 'rgba(34,197,94,0.1)',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
                borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)'
              }}>
                <Ionicons name="checkmark" size={32} color="#22c55e" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#f1f5f9', marginBottom: 8, fontFamily: 'Arial' }}>Berhasil!</Text>
              <Text style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', fontFamily: 'Arial' }}>Profil berhasil diperbarui</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#f1f5f9' },

  avatarSection: {
    alignItems: 'center', paddingVertical: 32, paddingBottom: 20,
  },
  avatarWrap: {
    width: 96, height: 96, position: 'relative',
  },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#cbd5e1',
  },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#0a0f1e',
  },
  avatarHint: { fontSize: 12, color: '#cbd5e1', marginTop: 14, fontWeight: '600', letterSpacing: 0.3 },

  form: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#cbd5e1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#f1f5f9',
  },
  inputDisabled: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
  },
  inputDisabledText: { fontSize: 14, color: '#cbd5e1' },
  inputHint: { fontSize: 11, color: '#cbd5e1', marginTop: 6 },

  saveButton: {
    backgroundColor: '#dc2626', borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },

  // Action Sheet
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#cbd5e1', alignSelf: 'center', marginTop: 12, marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 17, fontWeight: '800', color: '#f1f5f9', textAlign: 'center',
    marginBottom: 20,
  },
  sheetItem: {
    position: 'relative', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155',
  },
  sheetItemIcon: { position: 'absolute', left: 0 },
  sheetItemText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  sheetCancel: {
    marginTop: 12, paddingVertical: 16, borderRadius: 14,
    backgroundColor: '#0f172a', alignItems: 'center',
  },
  sheetCancelText: { fontSize: 15, fontWeight: '700', color: '#cbd5e1' },
});
