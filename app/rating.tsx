import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Alert, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function RatingScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);

  const stars = [1, 2, 3, 4, 5];
  const starLabels = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];

  const handleSubmit = async () => {
    if (rating === 0) { Alert.alert('Peringatan', 'Pilih rating terlebih dahulu!'); return; }

    setSaving(true);
    const { error } = await supabase.from('testimonials').insert({
      rating,
      review: review.trim() || null,
    });
    setSaving(false);

    if (error) {
      Alert.alert('Gagal', error.message);
    } else {
      Alert.alert(
        'Terima Kasih!',
        'Rating Anda membantu kami terus meningkatkan kualitas layanan.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.title}>Beri Rating</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconWrap}>
            <Ionicons name="star" size={48} color="#fcd34d" />
          </View>

          <Text style={[styles.heading, isSmall && { fontSize: 20 }]}>
            Bagaimana pengalaman Anda?
          </Text>
          <Text style={[styles.subheading, isSmall && { fontSize: 12 }]}>
            Kami senang mendengar pendapat Anda tentang layanan kami
          </Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {stars.map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
                <Ionicons
                  name={s <= rating ? 'star' : 'star-outline'}
                  size={isSmall ? 36 : 44}
                  color={s <= rating ? '#fcd34d' : '#334155'}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text style={styles.starLabel}>{starLabels[rating - 1]}</Text>
          )}

          {/* Review Input */}
          <View style={[styles.inputCard, isSmall && { padding: 14 }]}>
            <Text style={[styles.inputLabel, isSmall && { fontSize: 11 }]}>Tulis Review (opsional)</Text>
            <TextInput
              style={[styles.input, isSmall && { fontSize: 13, minHeight: 80 }]}
              placeholder="Ceritakan pengalaman Anda menyewa di Car Auto Retail..."
              placeholderTextColor="#475569"
              value={review}
              onChangeText={setReview}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, saving && styles.buttonDisabled, isSmall && { paddingVertical: 14 }]}
            onPress={handleSubmit}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="send" size={16} color="#fff" />
                <Text style={[styles.submitText, isSmall && { fontSize: 14 }]}>Kirim Rating</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: '#f1f5f9' },

  content: { flex: 1, padding: 24, alignItems: 'center' },
  iconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.1)', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, borderWidth: 1, borderColor: 'rgba(252,211,77,0.2)',
  },
  heading: { fontSize: 24, fontWeight: '900', color: '#f1f5f9', textAlign: 'center', marginBottom: 8 },
  subheading: { fontSize: 13, color: '#cbd5e1', textAlign: 'center', marginBottom: 32, lineHeight: 20 },

  starsRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  star: { marginHorizontal: 2 },
  starLabel: { fontSize: 15, fontWeight: '700', color: '#fcd34d', marginBottom: 32 },

  inputCard: {
    width: '100%', backgroundColor: '#1e293b', borderRadius: 18,
    padding: 18, borderWidth: 1, borderColor: '#334155', marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12, fontWeight: '700', color: '#cbd5e1', marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0f172a', borderRadius: 14, padding: 14,
    color: '#f1f5f9', fontSize: 14, minHeight: 100,
    borderWidth: 1, borderColor: '#334155', lineHeight: 22,
  },

  submitButton: {
    width: '100%', backgroundColor: '#f59e0b', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: '#f59e0b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
});
