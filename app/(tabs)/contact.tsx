import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const contactColors: Record<string, { bg: string; border: string }> = {
  whatsapp: { bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.25)' },
  location: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
  hours: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
};

export default function ContactScreen() {
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactItems, setContactItems] = useState<any[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');
  const [contactLoading, setContactLoading] = useState(true);

  useEffect(() => {
    supabase.from('contact_info').select('*').order('sort_order', { ascending: true }).then(({ data }) => {
      if (data && data.length > 0) {
        const displayItems = data.filter((r: any) => r.key !== 'whatsapp_number');
        const waNum = data.find((r: any) => r.key === 'whatsapp_number');
        setContactItems(displayItems);
        if (waNum) setWhatsappNumber(waNum.value);
      }
      setContactLoading(false);
    });
  }, []);

  const openWhatsApp = () => {
    const msg = 'Halo, saya ingin bertanya tentang rental mobil Anda.';
    Linking.openURL(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !message.trim()) {
      Alert.alert('Peringatan', 'Semua field harus diisi!');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('contacts').insert({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      if (error) throw error;
      Alert.alert('✅ Berhasil!', 'Pesan Anda telah terkirim. Kami akan segera menghubungi Anda!');
      setName('');
      setPhone('');
      setMessage('');
    } catch {
      Alert.alert('❌ Gagal', 'Gagal mengirim pesan. Silakan coba via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Hubungi Kami</Text>
              {/* subtitle removed */}
            </View>
            <View style={styles.headerBadge}>
              <Ionicons name="call" size={22} color="#f1f5f9" />
            </View>
          </View>

          {/* Contact Cards */}
          {contactLoading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#475569', fontSize: 13 }}>Memuat kontak...</Text>
            </View>
          ) : (
          <View style={[styles.contactGrid, isSmall && { gap: 6, padding: 12, paddingBottom: 0 }]}>
            {contactItems.map((item) => {
              const colors = contactColors[item.key] || { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)' };
              return (
              <TouchableOpacity
                key={item.key}
                style={[styles.contactCard, { backgroundColor: colors.bg, borderColor: colors.border }, isSmall && { padding: 10 }]}
                onPress={item.key === 'whatsapp' ? openWhatsApp : undefined}
                activeOpacity={item.key === 'whatsapp' ? 0.8 : 1}
              >
                <View style={[styles.contactIconBg, { backgroundColor: item.color + '25' }, isSmall && { width: 36, height: 36, borderRadius: 10 }]}>
                  <Ionicons name={item.key === 'whatsapp' ? 'logo-whatsapp' : item.key === 'location' ? 'location' : 'time'} size={isSmall ? 18 : 22} color={item.color} />
                </View>
                <Text style={[styles.contactLabel, isSmall && { fontSize: 9 }]}>{item.label}</Text>
                <Text style={[styles.contactValue, isSmall && { fontSize: 10, lineHeight: 15 }]}>{item.value}</Text>
                {item.sub && (
                  <View style={[styles.onlineBadge, { backgroundColor: item.color }, isSmall && { paddingHorizontal: 6, paddingVertical: 2 }]}>
                    <Text style={[styles.onlineBadgeText, isSmall && { fontSize: 8 }]}>{item.sub}</Text>
                  </View>
                )}
              </TouchableOpacity>
              );
            })}
          </View>
          )}

          {/* WhatsApp Big CTA */}
          <TouchableOpacity style={[styles.waBig, isSmall && { margin: 12, padding: 14 }]} onPress={openWhatsApp} activeOpacity={0.85}>
            <View style={[styles.waLeft, isSmall && { gap: 10 }]}>
              <View style={[styles.waIconBg, isSmall && { width: 44, height: 44 }]}>
                <Ionicons name="logo-whatsapp" size={isSmall ? 24 : 30} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.waTitle, isSmall && { fontSize: 14 }]}>Chat via WhatsApp</Text>
                <Text style={[styles.waSubtitle, isSmall && { fontSize: 11 }]}>Respon cepat, langsung terhubung!</Text>
              </View>
            </View>
            <View style={[styles.waArrowBg, isSmall && { width: 30, height: 30 }]}>
              <Text style={[styles.waArrow, isSmall && { fontSize: 15 }]}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Form */}
          <View style={[styles.form, isSmall && { margin: 12, padding: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 }}>
              <Ionicons name="mail" size={20} color="#f1f5f9" />
              <Text style={[styles.formTitle, isSmall && { fontSize: 17 }, { marginBottom: 0 }]}>Kirim Pesan</Text>
            </View>
            <Text style={[styles.formSubtitle, isSmall && { fontSize: 11 }]}>Atau isi form di bawah, kami akan membalas segera</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Nama Lengkap *</Text>
              <TextInput
                style={[styles.input, isSmall && { paddingVertical: 12, fontSize: 13 }]}
                placeholder="Contoh: Budi Santoso"
                placeholderTextColor="#475569"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Nomor HP / WhatsApp *</Text>
              <TextInput
                style={[styles.input, isSmall && { paddingVertical: 12, fontSize: 13 }]}
                placeholder="Contoh: 081234567890"
                placeholderTextColor="#475569"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isSmall && { fontSize: 11 }]}>Pesan / Pertanyaan *</Text>
              <TextInput
                style={[styles.input, styles.textarea, isSmall && { paddingVertical: 12, fontSize: 13, height: 90 }]}
                placeholder="Contoh: Saya ingin sewa Avanza untuk 3 hari, tanggal 1-3 Juli..."
                placeholderTextColor="#475569"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitDisabled, isSmall && { paddingVertical: 14 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="paper-plane" size={18} color="#fff" />
                  <Text style={[styles.submitText, isSmall && { fontSize: 14 }]}>Kirim Pesan</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#f1f5f9' },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 3 },
  headerBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  headerBadgeText: { fontSize: 22 },

  contactGrid: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 0 },
  contactCard: {
    flex: 1, borderRadius: 18, padding: 14, alignItems: 'center',
    borderWidth: 1,
  },
  contactIconBg: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  contactLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  contactValue: { fontSize: 11, fontWeight: '800', color: '#f1f5f9', textAlign: 'center', lineHeight: 17 },
  onlineBadge: {
    marginTop: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  onlineBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },

  waBig: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#16a34a', margin: 16, borderRadius: 20, padding: 18,
    shadowColor: '#16a34a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  waLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  waIconBg: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  waTitle: { fontSize: 16, fontWeight: '900', color: '#fff' },
  waSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  waArrowBg: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  waArrow: { fontSize: 18, color: '#fff', fontWeight: '700' },

  form: {
    backgroundColor: '#1e293b', margin: 16, borderRadius: 24, padding: 22,
    borderWidth: 1, borderColor: '#334155',
  },
  formTitle: { fontSize: 19, fontWeight: '900', color: '#f1f5f9', marginBottom: 4 },
  formSubtitle: { fontSize: 12, color: '#475569', marginBottom: 22 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#f1f5f9',
  },
  textarea: { height: 110, paddingTop: 14 },
  submitButton: {
    backgroundColor: '#dc2626', borderRadius: 16, paddingVertical: 17, alignItems: 'center',
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
});
