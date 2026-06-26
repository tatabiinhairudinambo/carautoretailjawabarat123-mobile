import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
  StatusBar,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import TestimonialCard from '../../components/TestimonialCard';
import AnimatedCard from '../../components/AnimatedCard';

const WHATSAPP_NUMBER = '6281234567890';

const stats = [
  { value: '500+', label: 'Pelanggan', icon: 'star' },
  { value: '50+', label: 'Armada', icon: 'car-sport' },
  { value: '24/7', label: 'Support', icon: 'shield-checkmark' },
];

const features = [
  { icon: 'checkmark-circle', title: 'Armada Terawat', desc: 'Semua unit dicek berkala dan dalam kondisi prima' },
  { icon: 'card', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi, semua jelas di awal' },
  { icon: 'map', title: 'Area Jawa Barat', desc: 'Melayani seluruh wilayah Jawa Barat' },
  { icon: 'flash', title: 'Booking Cepat', desc: 'Proses booking mudah dan cepat via WhatsApp' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isSmall = SCREEN_W < 375;

  const loadTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').limit(6);
    if (data && data.length > 0) setTestimonials(data);
    setTestimonialsLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTestimonials();
    setRefreshing(false);
  };

  const openWhatsApp = () => {
    const msg = 'Halo, saya ingin informasi tentang rental mobil Anda.';
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  const claimPromo = () => {
    const msg = 'Halo Car Auto Retail, saya ingin klaim promo diskon spesial 25% untuk sewa mobil pertama!';
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#dc2626" colors={['#dc2626']} />}
      >
        {/* Hero */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80' }}
          style={[styles.hero, { minHeight: isSmall ? 500 : 600 }]}
        >
          <View style={styles.heroOverlay} />
          <SafeAreaView edges={['top']} style={styles.heroContent}>
            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeDot}>●</Text>
              <Text style={styles.badgeText}>Rental Mobil Terpercaya</Text>
            </View>

            <Text style={[styles.heroTitle, { fontSize: isSmall ? 28 : 36, lineHeight: isSmall ? 36 : 44 }]}>
              Sewa Mobil Aman & Terpercaya di <Text style={styles.heroTitleAccent}>Jawa Barat</Text>
            </Text>

            <Text style={[styles.heroSubtitle, { fontSize: isSmall ? 13 : 15, lineHeight: isSmall ? 20 : 24 }]}>
              Armada terbaik, harga terjangkau, pelayanan profesional untuk perjalanan pribadi & bisnis.
            </Text>

            {/* CTA Buttons */}
            <View style={[styles.ctaButtons, isSmall && { flexDirection: 'column' }]}>
              <TouchableOpacity
                style={[styles.btnPrimary, isSmall && { width: '100%' }]}
                onPress={() => router.push('/cars')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>🚗 Pilih Armada Sekarang</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              {stats.map((s) => (
                <View key={s.label} style={[styles.statCard, isSmall && { padding: 10 }]}>
                  <Ionicons name={s.icon as any} size={isSmall ? 16 : 20} color="#ef4444" style={{ marginBottom: 6 }} />
                  <Text style={[styles.statValue, isSmall && { fontSize: 17 }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Promo Diskon Card Marketing */}
        <View style={styles.promoContainer}>
          <AnimatedCard delay={100} style={styles.promoCard} onPress={claimPromo}>
            <View style={styles.promoContent}>
              <View style={styles.promoBadgeRow}>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>PROMO SPESIAL</Text>
                </View>
                <Text style={styles.promoTimer}> Klaim Sekarang</Text>
              </View>

              <Text style={[styles.promoTitle, isSmall && { fontSize: 18 }]}>Diskon s.d. 25% Sewa Mobil Pertama!</Text>
              <Text style={[styles.promoSubtitle, isSmall && { fontSize: 12 }]}>
                Nikmati potongan harga eksklusif untuk semua rute & unit armada di Jawa Barat. Tanpa ribet!
              </Text>

              <View style={styles.promoCtaBtn}>
                <Ionicons name="pricetag" size={16} color="#fff" />
                <Text style={styles.promoCtaText}>Klaim Voucher Promo</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Grid Menu Utama disembunyikan sesuai permintaan */}

        {/* About Section */}
        <View style={[styles.section, { padding: isSmall ? 16 : 24 }]}>
          <View style={styles.sectionTagRow}>
            <View style={styles.sectionTagLine} />
            <Text style={styles.sectionTag}>KENAPA PILIH KAMI</Text>
            <View style={styles.sectionTagLine} />
          </View>
          <Text style={[styles.sectionTitle, isSmall && { fontSize: 20, lineHeight: 28 }]}>Layanan Premium, Harga Terjangkau</Text>
          <View style={styles.featuresGrid}>
            {features.map((f, i) => (
              <AnimatedCard key={f.title} delay={i * 100} style={[styles.featureCard, { width: isSmall ? '100%' : '48%', padding: isSmall ? 16 : 18 }]}>
                <View style={[styles.featureIconBg, isSmall && { width: 40, height: 40, borderRadius: 10 }]}>
                  <Ionicons name={f.icon as any} size={isSmall ? 20 : 22} color="#ef4444" />
                </View>
                <Text style={[styles.featureTitle, isSmall && { fontSize: 13 }]}>{f.title}</Text>
                <Text style={[styles.featureDesc, isSmall && { fontSize: 11 }]}>{f.desc}</Text>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialSection}>
          <View style={styles.sectionTagRow}>
            <View style={[styles.sectionTagLine, { backgroundColor: '#334155' }]} />
            <Text style={[styles.sectionTag, { color: '#dc2626' }]}>TESTIMONI</Text>
            <View style={[styles.sectionTagLine, { backgroundColor: '#334155' }]} />
          </View>
          <Text style={[styles.sectionTitle, { color: '#f1f5f9' }]}>Kata Pelanggan Kami</Text>
          {testimonialsLoading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#475569', fontSize: 13 }}>Memuat testimoni...</Text>
            </View>
          ) : testimonials.length > 0 ? (
            <FlatList
              data={testimonials}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item }) => <TestimonialCard item={item} />}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#475569', fontSize: 13 }}>Belum ada testimoni</Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <View style={[styles.ctaSection, isSmall && { margin: 12, padding: 24 }]}>
          <Ionicons name="rocket" size={isSmall ? 40 : 48} color="#fcd34d" style={{ marginBottom: 12 }} />
          <Text style={[styles.ctaTitle, isSmall && { fontSize: 20 }]}>Siap Mulai Perjalanan?</Text>
          <Text style={[styles.ctaSubtitle, isSmall && { fontSize: 12 }]}>Jelajahi pilihan armada kami atau hubungi kami sekarang juga untuk penawaran terbaik!</Text>
          <View style={[styles.ctaButtonsRow, { flexDirection: isSmall ? 'column' : 'row', gap: 12, width: '100%' }]}>
            <TouchableOpacity style={[styles.ctaButtonPrimary, isSmall && { paddingVertical: 13 }]} onPress={() => router.push('/cars')} activeOpacity={0.85}>
              <Text style={styles.ctaButtonTextPrimary}> Lihat Armada</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={[styles.ctaButtonSecondary, isSmall && { paddingVertical: 13 }]} onPress={openWhatsApp} activeOpacity={0.85}>
              <Text style={styles.ctaButtonTextSecondary}> Hubungi Langsung</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  hero: { minHeight: 600 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,8,20,0.82)',
  },
  heroContent: { padding: 20, paddingBottom: 32 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(220,38,38,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  badgeDot: { color: '#ef4444', fontSize: 8 },
  badgeText: { color: '#fca5a5', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', lineHeight: 44, marginBottom: 14 },
  heroTitleRed: { color: '#ef4444' },
  heroTitleAccent: { color: '#ef4444' },
  heroSubtitle: { fontSize: 15, color: '#94a3b8', lineHeight: 24, marginBottom: 28 },
  heroButtons: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  ctaButtons: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  btnPrimary: {
    flex: 1, backgroundColor: '#dc2626', paddingVertical: 15, borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.3 },
  btnSecondary: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 15, borderRadius: 16,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  btnSecondaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 16,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 10, color: '#94a3b8', marginTop: 3, fontWeight: '600' },

  // Promo Marketing Card
  promoContainer: { paddingHorizontal: 24, paddingTop: 20, backgroundColor: '#0f172a' },
  promoCard: {
    backgroundColor: '#1e293b', borderRadius: 18, padding: 20,
    borderWidth: 1, borderColor: '#334155',
  },
  promoContent: { position: 'relative' },
  promoBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  promoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.18)', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  promoBadgeText: { fontSize: 11, fontWeight: '800', color: '#fbbf24', letterSpacing: 0.5 },
  promoTimer: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  promoTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 6, lineHeight: 28 },
  promoSubtitle: { fontSize: 13, color: '#cbd5e1', lineHeight: 20, marginBottom: 18 },
  promoCtaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#dc2626', paddingVertical: 14, borderRadius: 16,
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  promoCtaText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  // Section
  section: { padding: 24, backgroundColor: '#0f172a' },
  sectionTagRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  sectionTagLine: { flex: 1, height: 1, backgroundColor: '#334155' },
  sectionTag: { fontSize: 10, fontWeight: '800', color: '#ef4444', letterSpacing: 2 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#f8fafc', marginBottom: 20, lineHeight: 32, textAlign: 'center' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  featureCard: {
    width: '48%', backgroundColor: '#1e293b', borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: '#334155',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  featureIconBg: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  featureEmoji: { fontSize: 22 },
  featureTitle: { fontSize: 14, fontWeight: '800', color: '#f1f5f9', marginBottom: 6 },
  featureDesc: { fontSize: 12, color: '#94a3b8', lineHeight: 18 },

  // Testimonials
  testimonialSection: { backgroundColor: '#0a0f1e', paddingTop: 24, paddingBottom: 24 },

  // CTA
  ctaSection: {
    margin: 20, backgroundColor: '#1e293b', borderRadius: 28, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: '#334155',
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  ctaEmoji: { fontSize: 40, marginBottom: 12 },
  ctaTitle: { fontSize: 24, fontWeight: '900', color: '#f1f5f9', textAlign: 'center', marginBottom: 8 },
  ctaSubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  ctaButtonsRow: { width: '100%' },
  ctaButtonPrimary: {
    flex: 1, backgroundColor: '#dc2626', paddingVertical: 15, borderRadius: 16,
    alignItems: 'center', shadowColor: '#dc2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  ctaButtonTextPrimary: { color: '#fff', fontWeight: '800', fontSize: 14 },
  ctaButtonSecondary: {
    flex: 1, backgroundColor: '#16a34a', paddingVertical: 15, borderRadius: 16,
    alignItems: 'center', shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  ctaButtonTextSecondary: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Grid Menu
  menuSection: {
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: '#0a0f1e',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  menuItem: {
    alignItems: 'center',
    marginBottom: 4,
  },
  menuIconBg: {
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  menuEmoji: {},
  menuText: {
    color: '#f8fafc',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
