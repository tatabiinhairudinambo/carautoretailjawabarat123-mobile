import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import PageLoader from '../../components/PageLoader';

export default function LoginScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim())    { Alert.alert('Peringatan', 'Email harus diisi!');    return; }
    if (!password.trim()) { Alert.alert('Peringatan', 'Password harus diisi!'); return; }

    setLoading(true);

    const [{ error }] = await Promise.all([
      supabase.auth.signInWithPassword({ email: email.trim(), password }),
      new Promise<void>(resolve => setTimeout(resolve, 5000)),
    ]);

    if (error) {
      setLoading(false);
      Alert.alert('Gagal Masuk', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Header */}
            <View style={styles.headerSection}>
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../assets/logo.jpg')}
                  style={styles.logoImg}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.brandName}>Car Auto Garage</Text>
              <Text style={[styles.title, isSmall && { fontSize: 24 }]}>Silahkan Masuk</Text>
            </View>

            {/* Form */}
            <View style={[styles.form, isSmall && { padding: 18 }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Alamat Email</Text>
                <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                  <Ionicons name="mail" size={18} color="#fbbf24" />
                  <TextInput
                    style={[styles.input, isSmall && { fontSize: 13 }]}
                    placeholder="email@domain.com"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Kata Sandi</Text>
                <View style={[styles.inputRow, isSmall && { paddingHorizontal: 14 }]}>
                  <Ionicons name="lock-closed" size={18} color="#fbbf24" />
                  <TextInput
                    style={[styles.input, isSmall && { fontSize: 13 }]}
                    placeholder="Masukkan kata sandi"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassRow}>
                <Text style={styles.forgotPassText}>Lupa Kata Sandi?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.buttonDisabled, isSmall && { paddingVertical: 14 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={[styles.loginButtonText, isSmall && { fontSize: 14 }]}>
                  Masuk
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Belum Memiliki Akun? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.footerLink}>Daftar</Text>
              </TouchableOpacity>
            </View>

            {/* Security badge */}
            <View style={styles.bottomInfo}>
              <View style={styles.bottomRow}>
                <Ionicons name="shield-checkmark" size={14} color="#10b981" />
                <Text style={styles.bottomText}>Koneksi 100% Terenkripsi & Aman</Text>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {loading && <PageLoader text="Sedang masuk..." />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  safeArea:  { flex: 1 },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    paddingBottom: 80,
  },

  headerSection: { alignItems: 'center', marginBottom: 36 },
  logoWrap: {
    width: 92, height: 92, borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2.5,
    borderColor: 'rgba(220,38,38,0.55)',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logoImg: { width: '100%', height: '100%' },
  brandName: {
    fontSize: 12, fontWeight: '800', color: '#fbbf24',
    letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase',
  },
  title: {
    fontSize: 28, fontWeight: '900', color: '#ffffff',
    marginBottom: 8, letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14, color: '#94a3b8',
    textAlign: 'center', paddingHorizontal: 20, lineHeight: 20,
  },

  form: {
    backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 28, padding: 26,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 12, fontWeight: '700', color: '#cbd5e1',
    marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 16, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  input: { flex: 1, fontSize: 15, color: '#f8fafc', paddingVertical: 16 },

  forgotPassRow: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPassText: { color: '#fbbf24', fontSize: 13, fontWeight: '700' },

  loginButton: {
    backgroundColor: '#fbbf24', borderRadius: 18, paddingVertical: 18, alignItems: 'center',
    shadowColor: '#fbbf24', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 12, elevation: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  loginButtonText: { color: '#0f172a', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: '#cbd5e1', fontSize: 14 },
  footerLink: { color: '#fbbf24', fontSize: 14, fontWeight: '800' },

  bottomInfo:  { marginTop: 16, alignItems: 'center' },
  bottomRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  bottomText: { fontSize: 11, color: '#cbd5e1', fontWeight: '600' },
});
