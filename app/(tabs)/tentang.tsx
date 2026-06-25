import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function TentangScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tentang Kami</Text>
          <Text style={styles.subtitle}>Mitra perjalanan terpercaya Anda</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.logoSection}>
            <Ionicons name="car-sport" size={64} color="#fcd34d" />
            <Text style={styles.companyName}>Car Auto Retail</Text>
            <Text style={styles.companyTagline}>Jawa Barat</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Siapa Kami</Text>
            <Text style={styles.sectionText}>
              Kami adalah penyedia layanan rental mobil terpercaya di Jawa Barat. Berkomitmen memberikan pengalaman perjalanan terbaik dengan armada yang terawat dan harga yang transparan.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visi</Text>
            <Text style={styles.sectionText}>
              Menjadi penyedia layanan rental mobil terdepan di Jawa Barat dengan pelayanan profesional dan harga terjangkau.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Misi</Text>
            <Text style={styles.sectionText}>
              • Menyediakan armada berkualitas dan terawat{'\n'}
              • Memberikan pelayanan cepat dan ramah{'\n'}
              • Harga transparan tanpa biaya tersembunyi{'\n'}
              • Kemudahan booking dan pengembalian
            </Text>
          </View>

          <View style={styles.valuesRow}>
            <View style={styles.valueCard}>
              <Ionicons name="star" size={32} color="#fcd34d" style={{ marginBottom: 8 }} />
              <Text style={styles.valueLabel}>Terpercaya</Text>
            </View>
            <View style={styles.valueCard}>
              <Ionicons name="people" size={32} color="#60a5fa" style={{ marginBottom: 8 }} />
              <Text style={styles.valueLabel}>Profesional</Text>
            </View>
            <View style={styles.valueCard}>
              <Ionicons name="pricetag" size={32} color="#4ade80" style={{ marginBottom: 8 }} />
              <Text style={styles.valueLabel}>Terjangkau</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#f1f5f9' },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 4 },
  content: { padding: 20 },
  logoSection: {
    alignItems: 'center', marginBottom: 28,
    backgroundColor: '#1e293b', borderRadius: 24, padding: 28,
    borderWidth: 1, borderColor: '#334155',
  },
  logoEmoji: { fontSize: 56, marginBottom: 12 },
  companyName: { fontSize: 22, fontWeight: '900', color: '#f1f5f9', marginBottom: 4 },
  companyTagline: { fontSize: 13, color: '#64748b' },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#dc2626', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },
  valuesRow: {
    flexDirection: 'row', gap: 10,
    backgroundColor: '#1e293b', borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: '#334155',
  },
  valueCard: { flex: 1, alignItems: 'center' },
  valueEmoji: { fontSize: 28, marginBottom: 6 },
  valueLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
});
