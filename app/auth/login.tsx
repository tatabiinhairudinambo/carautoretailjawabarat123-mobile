import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) { Alert.alert('Peringatan', 'Email harus diisi!'); return; }
    if (!password.trim()) { Alert.alert('Peringatan', 'Password harus diisi!'); return; }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Gagal Masuk', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.logoWrap}>
              <Ionicons name="car-sport" size={isSmall ? 36 : 44} color="#dc2626" />
            </View>
            <Text style={styles.brandName}>CarAutoRetail</Text>
            <Text style={[styles.title, isSmall && { fontSize: 20 }]}>Selamat Datang</Text>
            <Text style={[styles.subtitle, isSmall && { fontSize: 12 }]}>Masuk untuk melanjutkan</Text>
          </View>

          {/* Form */}
          <View style={[styles.form, isSmall && { padding: 18 }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Email</Text>
              <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                <Ionicons name="mail-outline" size={18} color="#64748b" />
                <TextInput
                  style={[styles.input, isSmall && { fontSize: 13 }]}
                  placeholder="contoh@email.com"
                  placeholderTextColor="#475569"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Password</Text>
              <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
                <TextInput
                  style={[styles.input, isSmall && { fontSize: 13 }]}
                  placeholder="Masukkan password"
                  placeholderTextColor="#475569"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled, isSmall && { paddingVertical: 14 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[styles.loginButtonText, isSmall && { fontSize: 14 }]}>Masuk</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.footerLink}>Daftar</Text>
            </TouchableOpacity>
          </View>

          {/* Security & Help */}
          <View style={styles.bottomInfo}>
            <View style={styles.bottomRow}>
              <Ionicons name="shield-checkmark" size={14} color="#fcd34d" />
              <Text style={styles.bottomText}>Akun Anda terjaga dan terenkripsi</Text>
            </View>
            <View style={styles.bottomDivider} />
            <View style={styles.bottomRow}>
              <TouchableOpacity onPress={() => router.push('/faq')} activeOpacity={0.7}>
                <Text style={styles.bottomLink}>Layanan & Bantuan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  subtitle: { fontSize: 13, color: '#cbd5e1' },
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
  loginButton: {
    backgroundColor: '#dc2626', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 6,
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#cbd5e1', fontSize: 14 },
  footerLink: { color: '#dc2626', fontSize: 14, fontWeight: '700' },

  bottomInfo: {
    marginTop: 32, alignItems: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 20,
  },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bottomText: { fontSize: 12, color: '#cbd5e1', fontWeight: '500' },
  bottomDivider: { width: 30, height: 1, backgroundColor: '#334155' },
  bottomLink: { fontSize: 12, color: '#60a5fa', fontWeight: '700' },
});
