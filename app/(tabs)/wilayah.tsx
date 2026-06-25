import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const regions = [
  { icon: 'business', name: 'Bandung Raya', desc: 'Kota Bandung, Cimahi, Kab. Bandung, Bandung Barat', color: '#3b82f6' },
  { icon: 'map', name: 'Jakarta & Bodetabek', desc: 'Jakarta, Bekasi, Depok, Tangerang, Bogor', color: '#10b981' },
  { icon: 'trail-sign', name: 'Priangan Timur', desc: 'Garut, Tasikmalaya, Ciamis, Pangandaran', color: '#f59e0b' },
  { icon: 'water', name: 'Cirebon Raya', desc: 'Cirebon, Indramayu, Majalengka, Kuningan', color: '#dc2626' },
  { icon: 'leaf', name: 'Sukabumi Raya', desc: 'Sukabumi, Cianjur', color: '#8b5cf6' },
  { icon: 'pin', name: 'Karawang & Purwakarta', desc: 'Karawang, Purwakarta, Subang', color: '#ec4899' },
];

export default function WilayahScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Wilayah Layanan</Text>
          <Text style={styles.subtitle}>Kami melayani seluruh wilayah Jawa Barat</Text>
        </View>

        <View style={styles.grid}>
          {regions.map((r) => (
            <View key={r.name} style={[styles.card, { borderLeftColor: r.color }]}>
              <View style={[styles.iconBg, { backgroundColor: r.color + '15' }]}>
                <Ionicons name={r.icon as any} size={28} color={r.color} />
              </View>
              <Text style={styles.cardName}>{r.name}</Text>
              <Text style={styles.cardDesc}>{r.desc}</Text>
            </View>
          ))}
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
  grid: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#1e293b', borderRadius: 16, padding: 16,
    borderLeftWidth: 4, borderWidth: 1, borderColor: '#334155',
  },
  iconBg: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardName: { fontSize: 15, fontWeight: '800', color: '#f1f5f9', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#64748b', lineHeight: 18 },
});
