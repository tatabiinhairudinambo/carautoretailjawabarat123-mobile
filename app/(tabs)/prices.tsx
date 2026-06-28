import React, { useEffect, useState, useRef } from 'react';
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
  RefreshControl,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const WHATSAPP_NUMBER = '6281234567890';

interface PriceItem {
  car_id?: string;
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

const notes: { text: string; icon: any; color: string }[] = [
  { text: 'Harga belum termasuk BBM', icon: 'water-outline', color: '#38bdf8' },
  { text: 'Driver tersedia dengan biaya tambahan', icon: 'person-outline', color: '#fbbf24' },
  { text: 'Deposit wajib sesuai kebijakan', icon: 'shield-checkmark-outline', color: '#4ade80' },
  { text: 'Pembayaran bisa transfer / tunai', icon: 'card-outline', color: '#a78bfa' },
  { text: 'Minimal sewa 12 jam', icon: 'time-outline', color: '#f43f5e' },
];

export default function PricesScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [prices, setPrices] = useState<PriceCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const stickyBarOpacity = scrollY.interpolate({
    inputRange: [50, 110],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadPrices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrices();
    setRefreshing(false);
  };

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
          car_id: row.car_id,
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

      {/* Sticky Animated Glass Top Bar */}
      <Animated.View style={[styles.stickyBar, { opacity: stickyBarOpacity }]}>
        <ImageBackground source={require('../../assets/logo.jpg')} style={styles.stickyBarBg}>
          <View style={styles.stickyBarOverlay} />
          <SafeAreaView edges={['top']} style={styles.stickyBarContent}>
            <View style={styles.stickyTitleRow}>
              <Text style={styles.stickyBarTitle}>Tarif Sewa</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#dc2626" colors={['#dc2626']} />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Animated Hero Red Burgundy Glass Header */}
        <Animated.View style={[styles.headerWrap, { transform: [{ translateY: headerTranslateY }] }]}>
          <ImageBackground source={require('../../assets/logo.jpg')} style={styles.headerBg} imageStyle={styles.headerBgImg}>
            <View style={styles.headerOverlay} />
            <SafeAreaView edges={['top']} style={{ paddingBottom: 16 }}>
              <View style={[styles.headerHeroTextWrap, isSmall && { paddingHorizontal: 16, paddingBottom: 12 }]}>
                <Text style={styles.heroBigTitle}>Tarif Sewa Eksekutif</Text>
                <Text style={styles.heroSubText}>Transparan, penawaran terbaik untuk sewa lepas kunci & pengemudi VIP</Text>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </Animated.View>

        {/* Category Filter Pills */}
        <View style={{ flexGrow: 0, flexShrink: 0, marginTop: 14, marginBottom: 6 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {['Semua', ...prices.map(p => p.category)].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterPill, selectedCat === cat && styles.filterPillActive]}
                onPress={() => setSelectedCat(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterPillText, selectedCat === cat && styles.filterPillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Info Banner */}
        <View style={[styles.infoBanner, isSmall && { marginHorizontal: 12, padding: 12 }]}>
          <Ionicons name="information-circle" size={20} color="#fbbf24" style={{ marginTop: -2 }} />
          <Text style={[styles.infoText, isSmall && { fontSize: 11 }]}>
            Harga dapat berubah pada musim liburan. Hubungi WhatsApp VIP kami untuk penawaran terbaik!
          </Text>
        </View>

        {loading ? (
          <View style={[styles.center, { padding: 40 }]}>
            <ActivityIndicator size="large" color="#dc2626" />
            <Text style={styles.loadingText}>Memuat harga...</Text>
          </View>
        ) : (
          <>
            {/* VIP Catalogue Book Chapters */}
            {prices.filter(cat => selectedCat === 'Semua' || cat.category === selectedCat).map((cat, catIdx) => (
              <View key={cat.category} style={[styles.bookChapterCard, isSmall && { margin: 12, marginBottom: 0 }]}>
                {/* Book Chapter Title Banner */}
                <View style={[styles.bookChapterHeader, { borderLeftColor: cat.color }, isSmall && { padding: 12 }]}>
                  <Ionicons name={getCategoryIcon(cat.emoji) as any} size={22} color={cat.color} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chapterSubText}>EDISI KATALOG • BAB {catIdx + 1}</Text>
                    <Text style={[styles.chapterBigTitle, isSmall && { fontSize: 15 }]}>{cat.category}</Text>
                  </View>
                  <View style={[styles.chapterBadge, { backgroundColor: cat.color + '20', borderColor: cat.color + '50' }]}>
                    <Text style={[styles.chapterBadgeText, { color: cat.color }]}>{cat.items.length} Unit</Text>
                  </View>
                </View>

                {/* Book Pages List */}
                <View style={styles.bookPagesContainer}>
                  {cat.items.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.bookPageRow, i < cat.items.length - 1 && styles.bookPageDivider, isSmall && { padding: 12 }]}
                      activeOpacity={0.75}
                      onPress={() => router.push({ pathname: '/car-detail', params: { id: item.car_id || '', name: item.name } })}
                    >
                      <View style={[styles.bookCarIconRing, { borderColor: cat.color + '40' }]}>
                        <Ionicons name="car-sport" size={18} color="#cbd5e1" />
                      </View>

                      <View style={styles.bookPageInfo}>
                        <Text style={[styles.bookCarName, isSmall && { fontSize: 13 }]} numberOfLines={1}>{item.name}</Text>
                        <View style={styles.bookDurationTag}>
                          <Ionicons name="time" size={11} color="#fbbf24" style={{ marginRight: 3 }} />
                          <Text style={styles.bookDurationText}>{item.duration}</Text>
                        </View>
                      </View>

                      <View style={styles.bookPagePriceWrap}>
                        <Text style={styles.bookPriceText}>{formatPrice(item.price)}</Text>
                        <Text style={styles.bookPriceSub}>/ sewa VIP</Text>
                      </View>

                      <Ionicons name="chevron-forward" size={16} color="#64748b" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Notes Section */}
            <Text style={[styles.notesTitle, isSmall && { fontSize: 16 }, { textAlign: 'center', marginBottom: 12, marginTop: 24 }]}>
              Catatan Penting
            </Text>
            <View style={{ paddingBottom: 20 }}>
              {notes.map((note, i) => (
                <View key={i} style={[styles.bookChapterCard, { marginTop: 0, marginBottom: 12, marginHorizontal: 16 }]}>
                  <View style={[styles.bookChapterHeader, { borderLeftColor: note.color, borderBottomWidth: 0, padding: 16 }]}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: note.color + '15', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: note.color + '40' }}>
                      <Ionicons name={note.icon} size={18} color={note.color} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={[styles.bookCarName, { fontSize: 13, lineHeight: 18 }]} numberOfLines={2}>{note.text}</Text>
                    </View>
                  </View>
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
      </Animated.ScrollView>
    </View>
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

  notesCardIndividual: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  noteIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteItemIndividual: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    flex: 1,
    lineHeight: 18,
  },
  notesTitle: { fontSize: 15, fontWeight: '800', color: '#f1f5f9', marginBottom: 14 },

  waButton: {
    backgroundColor: '#16a34a', marginHorizontal: 16, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: '#22c55e', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 8,
  },
  waButtonText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  center: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#475569', marginTop: 12, fontSize: 14 },

  // Redesign Styles
  stickyBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0f1e',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  stickyBarBg: {
    width: '100%',
  },
  stickyBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.88)',
  },
  stickyBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  stickyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyBarTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '900',
  },
  headerWrap: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#0a0f1e',
    marginBottom: 16,
  },
  headerBg: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#0a0f1e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  headerBgImg: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.92)',
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  locSubtitle: {
    fontSize: 11,
    color: '#fecdd3',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  locTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locTitleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'Arial',
  },
  notifBtnGlass: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  goldDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
  },
  headerHeroTextWrap: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 22,
  },
  heroBigTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'Arial',
  },
  heroSubText: {
    fontSize: 13,
    color: '#fbbf24',
    marginTop: 4,
    fontFamily: 'Arial',
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1.2,
    borderColor: '#334155',
  },
  filterPillActive: {
    backgroundColor: '#dc2626',
    borderColor: '#ff4d4d',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#cbd5e1',
  },
  filterPillTextActive: {
    color: '#ffffff',
  },

  // Catalogue Book UI Styles
  bookChapterCard: {
    backgroundColor: '#1e293b', margin: 16, marginBottom: 0,
    borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: '#334155',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
  },
  bookChapterHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#0f172a', padding: 16, borderLeftWidth: 5,
    borderBottomWidth: 1, borderBottomColor: '#334155',
  },
  chapterSubText: {
    fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase',
  },
  chapterBigTitle: {
    fontSize: 17, fontWeight: '900', color: '#f1f5f9', marginTop: 2, fontFamily: 'Arial',
  },
  chapterBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1,
  },
  chapterBadgeText: { fontSize: 11, fontWeight: '800' },
  bookPagesContainer: {
    backgroundColor: '#1e293b',
  },
  bookPageRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
  },
  bookPageDivider: {
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  bookCarIconRing: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#0f172a',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, marginRight: 12,
  },
  bookPageInfo: {
    flex: 1,
  },
  bookCarName: {
    fontSize: 14, fontWeight: '800', color: '#f8fafc', fontFamily: 'Arial',
  },
  bookDurationTag: {
    flexDirection: 'row', alignItems: 'center', marginTop: 4,
    backgroundColor: 'rgba(245,158,11,0.12)', paddingHorizontal: 7, paddingVertical: 2.5,
    borderRadius: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)',
  },
  bookDurationText: {
    fontSize: 10, fontWeight: '700', color: '#fbbf24',
  },
  bookPagePriceWrap: {
    alignItems: 'flex-end', justifyContent: 'center',
  },
  bookPriceText: {
    fontSize: 13, fontWeight: '900', color: '#ef4444', fontFamily: 'Arial',
  },
  bookPriceSub: {
    fontSize: 9, fontWeight: '600', color: '#64748b', marginTop: 1,
  },
});
