import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Image, Linking, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const WHATSAPP_NUMBER = '6281234567890';

export default function CarDetailScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((id && id !== '') || (name && name !== '')) loadCar();
    else setLoading(false);
  }, [id, name]);

  const loadCar = async () => {
    let query = supabase.from('cars').select('*');
    if (id && id !== '' && id !== 'undefined') {
      query = query.eq('id', id);
    } else if (name && name !== '' && name !== 'undefined') {
      const decoded = decodeURIComponent(name as string);
      query = query.ilike('name', `%${decoded}%`);
    }
    const { data } = await query;
    if (data && data.length > 0) setCar(data[0]);
    setLoading(false);
  };

  const handlePayment = () => {
    if (!car) return;
    router.push(`/payment?id=${car.id}`);
  };

  const formatPrice = (price: number) =>
    'Rp ' + new Intl.NumberFormat('id-ID').format(price);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}><ActivityIndicator size="large" color="#dc2626" /></View>
      </SafeAreaView>
    );
  }

  if (!car) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.title}>Detail Armada</Text>
        </View>
        <View style={styles.center}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Armada tidak ditemukan</Text>
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
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.title}>Detail Armada</Text>
        </View>

        {/* Image */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: car.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlay} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={[styles.name, isSmall && { fontSize: 20 }, { marginBottom: 0 }]}>{car.name}</Text>
            <View style={[styles.conditionChip, { marginBottom: 0 }]}>
              <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
              <Text style={styles.conditionChipText}>Tersedia</Text>
            </View>
          </View>
          <Text style={[styles.brand, isSmall && { fontSize: 13 }]}>{car.brand}</Text>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Tarif Kendaraan</Text>
            <Text style={[styles.price, isSmall && { fontSize: 22 }]}>{formatPrice(car.price)}</Text>
          </View>

          {/* Specs */}
          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Ionicons name="calendar-outline" size={20} color="#64748b" />
              <Text style={styles.specLabel}>Tahun</Text>
              <Text style={styles.specValue}>{car.year}</Text>
            </View>
            <View style={styles.specSep} />
            <View style={styles.specItem}>
              <Ionicons name="settings-outline" size={20} color="#64748b" />
              <Text style={styles.specLabel}>Transmisi</Text>
              <Text style={styles.specValue}>{car.transmission}</Text>
            </View>
            <View style={styles.specSep} />
            <View style={styles.specItem}>
              <Ionicons name="people-outline" size={20} color="#64748b" />
              <Text style={styles.specLabel}>Kapasitas</Text>
              <Text style={styles.specValue}>{car.passengers} Kursi</Text>
            </View>
          </View>


          {/* Features */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Fitur & Fasilitas</Text>
            <View style={styles.featuresGrid}>
              {car.features?.map((f: string, i: number) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Ionicons name="information-circle" size={20} color="#fbbf24" />
              <Text style={styles.noteTitle}>Catatan Penting</Text>
            </View>
            <Text style={styles.noteText}>• Harga sewa belum termasuk bensin, tol, dan parkir.</Text>
            <Text style={styles.noteText}>• Penyewaan lepas kunci wajib melampirkan identitas diri (KTP/SIM).</Text>
            <Text style={styles.noteText}>• Pembatalan pada hari H akan dikenakan potongan 50%.</Text>
          </View>

          {/* Booking CTA */}
          <TouchableOpacity style={styles.payButton} onPress={handlePayment} activeOpacity={0.85}>
            <Ionicons name="card-outline" size={22} color="#0a0f1e" />
            <View>
              <Text style={styles.payButtonTitle}>Pesan Sekarang</Text>
              <Text style={styles.payButtonSub}>Lanjut ke Pembayaran</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: '#fbbf24', marginLeft: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  imageWrap: { position: 'relative', height: 260 },
  image: { width: '100%', height: '100%', backgroundColor: '#0f172a' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,15,30,0.2)' },

  content: { padding: 20 },
  conditionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(22,163,74,0.1)', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(22,163,74,0.25)', marginBottom: 20,
  },
  conditionChipText: { fontSize: 12, fontWeight: '700', color: '#16a34a' },
  name: { fontSize: 24, fontWeight: '900', color: '#ef4444', marginBottom: 4 },
  brand: { fontSize: 14, color: '#cbd5e1', fontWeight: '600', marginBottom: 20 },

  priceCard: {
    backgroundColor: 'rgba(251,191,36,0.1)', borderRadius: 16,
    padding: 18, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)',
    marginBottom: 20, alignItems: 'center',
  },
  priceLabel: { fontSize: 12, color: '#cbd5e1', fontWeight: '600', marginBottom: 6 },
  price: { fontSize: 26, fontWeight: '900', color: '#fbbf24' },

  specsRow: {
    flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 16,
    borderWidth: 1, borderColor: '#334155', marginBottom: 20, overflow: 'hidden',
  },
  specItem: { flex: 1, alignItems: 'center', padding: 18, gap: 6 },
  specSep: { width: 1, backgroundColor: '#334155' },
  specLabel: { fontSize: 11, color: '#cbd5e1', fontWeight: '600' },
  specValue: { fontSize: 14, color: '#f1f5f9', fontWeight: '800' },

  featuresCard: {
    backgroundColor: '#1e293b', borderRadius: 18,
    padding: 18, borderWidth: 1, borderColor: '#334155', marginBottom: 24,
  },
  featuresTitle: { fontSize: 15, fontWeight: '800', color: '#f1f5f9', marginBottom: 14 },
  featuresGrid: { gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 13, color: '#cbd5e1', fontWeight: '500' },

  noteCard: {
    backgroundColor: 'rgba(251,191,36,0.08)', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
    marginBottom: 24,
  },
  noteHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  noteTitle: { fontSize: 14, fontWeight: '800', color: '#fbbf24' },
  noteText: { fontSize: 12, color: '#cbd5e1', lineHeight: 20, marginBottom: 4 },

  payButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: '#fbbf24', borderRadius: 18, paddingVertical: 18,
    shadowColor: '#fbbf24', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  payButtonTitle: { color: '#0a0f1e', fontSize: 16, fontWeight: '800' },
  payButtonSub: { color: 'rgba(10,15,30,0.7)', fontSize: 11, fontWeight: '700', marginTop: 1 },
});
