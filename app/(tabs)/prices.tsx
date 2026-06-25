import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const WHATSAPP_NUMBER = '6281234567890';

interface PriceItem {
  name: string;
  duration: string;
  price: number;
}

interface PriceCategory {
  category: string;
  emoji: string;
  color: string;
  items: PriceItem[];
}

const formatPrice = (price: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(price);

const getCategoryIcon = (emoji: string) => {
  if (emoji === '🚗') return 'car-sport';
  if (emoji === '🚙') return 'car';
  if (emoji === '🚐') return 'bus';
  return 'car-sport';
};

const notes = [
  'Harga belum termasuk BBM',
  'Driver tersedia dengan biaya tambahan',
  'Deposit wajib sesuai kebijakan',
  'Pembayaran bisa transfer / tunai',
  'Minimal sewa 12 jam',
];

export default function PricesScreen() {
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [prices, setPrices] = useState<PriceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    const { data } = await supabase
      .from('prices')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data && data.length > 0) {
      const grouped: Record<string, PriceCategory> = {};
      for (const row of data) {
        if (!grouped[row.category]) {
          grouped[row.category] = {
            category: row.category,
            emoji: row.category_emoji,
            color: row.category_color,
            items: [],
          };
        }
        grouped[row.category].items.push({
          name: row.name,
          duration: row.duration,
          price: row.price,
        });
      }
      setPrices(Object.values(grouped));
    }
    setLoading(false);
  };

  const openWhatsApp = () => {
    const msg = 'Halo, saya ingin bertanya tentang harga sewa mobil.';
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, isSmall && { fontSize: 20 }]}>Daftar Harga</Text>
            <Text style={[styles.subtitle, isSmall && { fontSize: 11, maxWidth: 180 }]}>Harga sewa per unit, belum termasuk BBM & driver</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="pricetag" size={22} color="#f1f5f9" />
          </View>
        </View>

        {/* Info Banner */}
        <View style={[styles.infoBanner, isSmall && { marginHorizontal: 12, padding: 12 }]}>
          <Ionicons name="information-circle" size={20} color="#fbbf24" style={{ marginTop: -2 }} />
          <Text style={[styles.infoText, isSmall && { fontSize: 11 }]}>
            Harga dapat berubah sewaktu-waktu. Hubungi kami untuk penawaran terbaik!
          </Text>
        </View>

        {loading ? (
          <View style={[styles.center, { padding: 40 }]}>
            <ActivityIndicator size="large" color="#dc2626" />
            <Text style={styles.loadingText}>Memuat harga...</Text>
          </View>
        ) : (
          <>
            {/* Price Categories */}
            {prices.map((cat) => (
              <View key={cat.category} style={[styles.categoryCard, isSmall && { margin: 12, marginBottom: 0 }]}>
                <View style={[styles.categoryHeader, { borderLeftColor: cat.color }, isSmall && { padding: 12, gap: 8 }]}>
                  <Ionicons name={getCategoryIcon(cat.emoji) as any} size={isSmall ? 20 : 24} color={cat.color} />
                  <Text style={[styles.categoryTitle, isSmall && { fontSize: 13 }]}>{cat.category}</Text>
                  <View style={[styles.categoryBadge, { backgroundColor: cat.color + '20', borderColor: cat.color + '40' }, isSmall && { paddingHorizontal: 8, paddingVertical: 3 }]}>
                    <Text style={[styles.categoryBadgeText, { color: cat.color }, isSmall && { fontSize: 10 }]}>{cat.items.length} unit</Text>
                  </View>
                </View>

                <View style={[styles.tableHeader, isSmall && { paddingHorizontal: 10, paddingVertical: 8 }]}>
                  <Text style={[styles.tableCell, { flex: 2 }, isSmall && { fontSize: 10 }]}>Unit</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }, isSmall && { fontSize: 10 }]}>Durasi</Text>
                  <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }, isSmall && { fontSize: 10 }]}>Harga</Text>
                </View>

                {cat.items.map((item, i) => (
                  <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt, isSmall && { paddingHorizontal: 10, paddingVertical: 10 }]}>
                    <Text style={[styles.rowName, { flex: 2 }, isSmall && { fontSize: 11 }]} numberOfLines={2}>{item.name}</Text>
                    <View style={[styles.durationBadge, { flex: 1, alignSelf: 'center' }, isSmall && { paddingHorizontal: 6, paddingVertical: 3 }]}>
                      <Text style={[styles.durationText, isSmall && { fontSize: 10 }]}>{item.duration}</Text>
                    </View>
                    <Text style={[styles.priceText, { flex: 1.5 }, isSmall && { fontSize: 11 }]}>{formatPrice(item.price)}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Notes */}
            <View style={[styles.notesCard, isSmall && { margin: 12, padding: 14 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 }}>
                <Ionicons name="clipboard" size={18} color="#f1f5f9" />
                <Text style={[styles.notesTitle, isSmall && { fontSize: 14 }, { marginBottom: 0 }]}>Catatan Penting</Text>
              </View>
              {notes.map((note, i) => (
                <View key={i} style={styles.noteRow}>
                  <View style={styles.noteDot} />
                  <Text style={[styles.noteItem, isSmall && { fontSize: 12 }]}>{note}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity style={[styles.waButton, isSmall && { marginHorizontal: 12, paddingVertical: 14 }]} onPress={openWhatsApp} activeOpacity={0.85}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                <Text style={[styles.waButtonText, isSmall && { fontSize: 14 }]}>Tanya Harga via WhatsApp</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
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
  subtitle: { fontSize: 12, color: '#475569', marginTop: 4, maxWidth: 220 },
  headerBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  headerBadgeText: { fontSize: 22 },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: 'rgba(245,158,11,0.1)', marginHorizontal: 16, marginTop: 14,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)',
  },
  infoText: { flex: 1, fontSize: 12, color: '#fbbf24', lineHeight: 18 },

  categoryCard: {
    backgroundColor: '#1e293b', margin: 16, marginBottom: 0,
    borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#334155',
  },
  categoryHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#0f172a', padding: 16, borderLeftWidth: 4,
  },
  categoryTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: '#f1f5f9' },
  categoryBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '700' },

  tableHeader: {
    flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#334155',
  },
  tableCell: { fontSize: 11, color: '#475569', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  tableRow: {
    flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12,
    alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  tableRowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  rowName: { fontSize: 12, color: '#cbd5e1', fontWeight: '500', paddingRight: 8 },
  durationBadge: {
    backgroundColor: 'rgba(59,130,246,0.15)', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(59,130,246,0.25)',
  },
  durationText: { fontSize: 11, fontWeight: '700', color: '#60a5fa' },
  priceText: { fontSize: 12, fontWeight: '800', color: '#dc2626', textAlign: 'right' },

  notesCard: {
    backgroundColor: '#1e293b', margin: 16, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: '#334155', borderLeftWidth: 4, borderLeftColor: '#dc2626',
  },
  notesTitle: { fontSize: 15, fontWeight: '800', color: '#f1f5f9', marginBottom: 14 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  noteDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#dc2626' },
  noteItem: { fontSize: 13, color: '#94a3b8', flex: 1, lineHeight: 20 },

  waButton: {
    backgroundColor: '#16a34a', marginHorizontal: 16, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: '#16a34a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  waButtonText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  center: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#475569', marginTop: 12, fontSize: 14 },
});
