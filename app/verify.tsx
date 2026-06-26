import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function VerifyScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;

  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const meta = data.user.user_metadata || {};
      setFullName(meta.full_name || '');
      setPhone(meta.phone || '');
      setNik(meta.nik || '');
      setAddress(meta.address || '');
      setOccupation(meta.occupation || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!nik.trim()) { Alert.alert('Peringatan', 'Nomor KTP harus diisi!'); return; }
    if (nik.trim().length < 16) { Alert.alert('Peringatan', 'Nomor KTP harus 16 digit!'); return; }
    if (!fullName.trim()) { Alert.alert('Peringatan', 'Nama lengkap harus diisi!'); return; }
    if (!phone.trim()) { Alert.alert('Peringatan', 'Nomor HP harus diisi!'); return; }
    if (!address.trim()) { Alert.alert('Peringatan', 'Alamat harus diisi!'); return; }
    if (!occupation.trim()) { Alert.alert('Peringatan', 'Pekerjaan harus diisi!'); return; }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { nik: nik.trim(), full_name: fullName.trim(), phone: phone.trim(), address: address.trim(), occupation: occupation.trim(), verified: true },
    });
    setSaving(false);

    if (error) {
      Alert.alert('Gagal Simpan', error.message);
    } else {
      Alert.alert(
        'Berhasil!',
        'Data verifikasi berhasil disimpan. Anda sekarang dapat menyewa armada.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator size="large" color="#dc2626" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerSection}>
              <View style={styles.logoWrap}>
                <Ionicons name="shield-checkmark" size={isSmall ? 28 : 36} color="#dc2626" />
              </View>
              <Text style={styles.brandName}>CarAutoRetail</Text>
              <Text style={[styles.title, isSmall && { fontSize: 20 }]}>Verifikasi Akun</Text>
              <Text style={[styles.subtitle, isSmall && { fontSize: 12 }]}>
                Lengkapi data diri untuk menyewa armada
              </Text>
            </View>

            {/* Form */}
            <View style={[styles.form, isSmall && { padding: 18 }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Nomor KTP</Text>
                <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                  <Ionicons name="card-outline" size={18} color="#64748b" />
                  <TextInput
                    style={[styles.input, isSmall && { fontSize: 13 }]}
                    placeholder="16 digit NIK"
                    placeholderTextColor="#475569"
                    value={nik}
                    onChangeText={setNik}
                    keyboardType="number-pad"
                    maxLength={16}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Nama Lengkap</Text>
                <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                  <Ionicons name="person-outline" size={18} color="#64748b" />
                  <TextInput
                    style={[styles.input, isSmall && { fontSize: 13 }]}
                    placeholder="Sesuai KTP"
                    placeholderTextColor="#475569"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Nomor HP</Text>
                <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                  <Ionicons name="call-outline" size={18} color="#64748b" />
                  <TextInput
                    style={[styles.input, isSmall && { fontSize: 13 }]}
                    placeholder="08xxxxxxxxxx"
                    placeholderTextColor="#475569"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Alamat Lengkap</Text>
                <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                  <Ionicons name="location-outline" size={18} color="#64748b" />
                  <TextInput
                    style={[styles.input, isSmall && { fontSize: 13 }]}
                    placeholder="Alamat sesuai KTP"
                    placeholderTextColor="#475569"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Pekerjaan</Text>
                <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                  <Ionicons name="briefcase-outline" size={18} color="#64748b" />
                  <TextInput
                    style={[styles.input, isSmall && { fontSize: 13 }]}
                    placeholder="Pekerjaan saat ini"
                    placeholderTextColor="#475569"
                    value={occupation}
                    onChangeText={setOccupation}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.buttonDisabled, isSmall && { paddingVertical: 14 }]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={[styles.saveButtonText, isSmall && { fontSize: 14 }]}>Simpan Data</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.infoSection}>
              <Ionicons name="information-circle-outline" size={16} color="#60a5fa" />
              <Text style={styles.infoText}>
                Data Anda akan digunakan sebagai syarat penyewaan armada dan dilindungi privasi.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  content: { flex: 1, padding: 24 },
  headerSection: { alignItems: 'center', marginBottom: 28 },
  logoWrap: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: 'rgba(220,38,38,0.12)', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(220,38,38,0.25)',
  },
  brandName: {
    fontSize: 14, fontWeight: '800', color: '#dc2626', letterSpacing: 1.5,
    marginBottom: 12, textTransform: 'uppercase',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#f1f5f9', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#cbd5e1', textAlign: 'center', paddingHorizontal: 20 },
  form: {
    backgroundColor: '#1e293b', borderRadius: 22, padding: 22,
    borderWidth: 1, borderColor: '#334155',
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#cbd5e1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#0f172a', borderRadius: 14, paddingHorizontal: 16,
    borderWidth: 1, borderColor: '#334155',
  },
  input: { flex: 1, fontSize: 14, color: '#f1f5f9', paddingVertical: 14 },
  saveButton: {
    backgroundColor: '#dc2626', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 6,
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  infoSection: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginTop: 24, paddingHorizontal: 16,
  },
  infoText: { fontSize: 12, color: '#cbd5e1', flex: 1, lineHeight: 18 },
});
