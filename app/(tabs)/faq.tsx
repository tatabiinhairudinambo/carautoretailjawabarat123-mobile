import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQ_DATA = [
  {
    question: 'Apakah bisa sewa lepas kunci?',
    answer: 'Ya, kami melayani sewa mobil lepas kunci maupun dengan supir. Untuk lepas kunci, Anda perlu menyiapkan dokumen jaminan seperti KTP asli, KK, dan jaminan kendaraan bermotor/deposit.'
  },
  {
    question: 'Apa saja syarat penyewaannya?',
    answer: 'Syarat utama meliputi KTP, SIM A yang masih berlaku, dan dokumen pendukung lainnya. Proses verifikasi data hanya memakan waktu sekitar 15-30 menit.'
  },
  {
    question: 'Apakah bisa dijemput di bandara/stasiun?',
    answer: 'Tentu! Kami menyediakan layanan antar-jemput unit ke Bandara, Stasiun, atau hotel tempat Anda menginap di seluruh area pelayanan kami.'
  },
  {
    question: 'Bagaimana jika mobil mengalami kendala di jalan?',
    answer: 'Kami menyediakan layanan Bantuan Darurat 24/7. Anda cukup menghubungi nomor kontak darurat kami, dan tim mekanik atau unit pengganti akan segera dikirimkan ke lokasi Anda.'
  },
  {
    question: 'Apakah harga sudah termasuk BBM dan Tol?',
    answer: 'Untuk paket Lepas Kunci, harga belum termasuk BBM, Tol, dan parkir. Sedangkan untuk paket All-In (dengan supir), semua biaya operasional sudah termasuk dalam harga sewa.'
  }
];

export default function FAQScreen() {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <View style={styles.header}>
        <Ionicons name="help-buoy" size={48} color="#3b82f6" style={{ marginBottom: 12 }} />
        <Text style={styles.headerTitle}>Bantuan & FAQ</Text>
        <Text style={styles.headerSubtitle}>Temukan jawaban untuk pertanyaan yang sering diajukan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {FAQ_DATA.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
              onPress={() => setExpandedIndex(isExpanded ? null : index)}
              activeOpacity={0.8}
            >
              <View style={styles.questionRow}>
                <Text style={[styles.questionText, isExpanded && styles.questionTextActive]}>{item.question}</Text>
                <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#64748b" />
              </View>
              {isExpanded && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  faqCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  faqCardExpanded: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
    paddingRight: 16,
    lineHeight: 22,
  },
  questionTextActive: {
    color: '#60a5fa',
  },
  chevron: {
    fontSize: 12,
    color: '#64748b',
  },
  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  answerText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 24,
  },
});
