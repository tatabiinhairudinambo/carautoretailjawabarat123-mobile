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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import TestimonialCard from '../../components/TestimonialCard';

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
  const isSmall = SCREEN_W < 375;

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .limit(6);
      if (data && data.length > 0) setTestimonials(data);
      setTestimonialsLoading(false);
    })();
  }, []);

  const openWhatsApp = () => {
    const msg = 'Halo, saya ingin informasi tentang rental mobil Anda.';
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView showsVerticalScrollIndicator={false}>
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
              Rental Mobil{'\n'}
              <Text style={styles.heroTitleRed}>Terpercaya</Text>
              {'\n'}untuk Perjalanan Anda
            </Text>

            <Text style={[styles.heroSubtitle, { fontSize: isSmall ? 13 : 15 }]}>
              Armada terbaik, harga terjangkau, pelayanan profesional untuk perjalanan pribadi & bisnis.
            </Text>

            {/* Buttons */}
            <View style={[styles.heroButtons, { flexDirection: isSmall ? 'column' : 'row', gap: isSmall ? 10 : 12 }]}>
              <TouchableOpacity
                style={[styles.btnPrimary, isSmall && { width: '100%' }]}
                onPress={() => router.push('/cars')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>🚘 Lihat Armada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSecondary, isSmall && { width: '100%' }]}
                onPress={openWhatsApp}
                activeOpacity={0.85}
              >
                <Text style={styles.btnSecondaryText}>📱 Hubungi Langsung</Text>
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

        {/* Grid Menu Utama */}
        <View style={[styles.menuSection, { paddingHorizontal: isSmall ? 16 : 24 }]}>
          <View style={styles.menuGrid}>
            {[
              { id: 'cars', title: 'Armada', icon: 'car-outline', route: '/cars' },
              { id: 'wilayah', title: 'Wilayah', icon: 'location-outline', route: '/wilayah' },
              { id: 'prices', title: 'Harga', icon: 'pricetag-outline', route: '/prices' },
              { id: 'index', title: 'Beranda', icon: 'home-outline', route: '/' },
              { id: 'contact', title: 'Kontak', icon: 'call-outline', route: '/contact' },
              { id: 'tentang', title: 'Tentang', icon: 'information-circle-outline', route: '/tentang' },
              { id: 'faq', title: 'Bantuan', icon: 'help-circle-outline', route: '/faq' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { width: SCREEN_W > 768 ? '13%' : '22%' }]}
                onPress={() => item.id === 'index' ? null : router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBg, { width: isSmall ? 52 : 60, height: isSmall ? 52 : 60, borderRadius: isSmall ? 18 : 22 }]}>
                  <Ionicons name={item.icon as any} size={isSmall ? 28 : 32} color="#dc2626" />
                </View>
                <Text style={[styles.menuText, { fontSize: isSmall ? 11 : 13 }]} numberOfLines={1} adjustsFontSizeToFit>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { padding: isSmall ? 16 : 24 }]}>
          <View style={styles.sectionTagRow}>
            <View style={styles.sectionTagLine} />
            <Text style={styles.sectionTag}>KENAPA PILIH KAMI</Text>
            <View style={styles.sectionTagLine} />
          </View>
          <Text style={[styles.sectionTitle, isSmall && { fontSize: 20, lineHeight: 28 }]}>Layanan Premium, Harga Terjangkau</Text>
          <View style={[styles.featuresGrid, { gap: isSmall ? 8 : 12 }]}>
            {features.map((f) => (
              <View key={f.title} style={[styles.featureCard, { width: isSmall ? '48%' : '47%', padding: isSmall ? 14 : 18 }]}>
                <View style={[styles.featureIconBg, isSmall && { width: 38, height: 38, borderRadius: 10 }]}>
                  <Ionicons name={f.icon as any} size={isSmall ? 18 : 22} color="#dc2626" />
                </View>
                <Text style={[styles.featureTitle, isSmall && { fontSize: 12 }]}>{f.title}</Text>
                <Text style={[styles.featureDesc, isSmall && { fontSize: 10 }]}>{f.desc}</Text>
              </View>
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
              <Text style={styles.ctaButtonTextPrimary}>🚘 Lihat Armada</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctaButtonSecondary, isSmall && { paddingVertical: 13 }]} onPress={openWhatsApp} activeOpacity={0.85}>
              <Text style={styles.ctaButtonTextSecondary}>📱 Hubungi Langsung</Text>
            </TouchableOpacity>
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
  heroSubtitle: { fontSize: 15, color: '#94a3b8', lineHeight: 24, marginBottom: 28 },
  heroButtons: { flexDirection: 'row', gap: 12, marginBottom: 32 },
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
    flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 10, color: '#64748b', marginTop: 3, fontWeight: '600' },

  // Section
  section: { padding: 24, backgroundColor: '#0f172a' },
  sectionTagRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  sectionTagLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  sectionTag: { fontSize: 10, fontWeight: '800', color: '#dc2626', letterSpacing: 2 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#f8fafc', marginBottom: 20, lineHeight: 32, textAlign: 'center' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: {
    width: '47%', backgroundColor: '#1e293b', borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: '#334155',
  },
  featureIconBg: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(220,38,38,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  featureEmoji: { fontSize: 22 },
  featureTitle: { fontSize: 13, fontWeight: '800', color: '#f1f5f9', marginBottom: 6 },
  featureDesc: { fontSize: 11, color: '#64748b', lineHeight: 17 },

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
  ctaSubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  ctaButtonsRow: { width: '100%' },
  ctaButtonPrimary: {
    flex: 1, backgroundColor: '#16a34a', paddingVertical: 15, borderRadius: 16,
    alignItems: 'center', shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  ctaButtonTextPrimary: { color: '#fff', fontWeight: '800', fontSize: 14 },
  ctaButtonSecondary: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 15, borderRadius: 16,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  ctaButtonTextSecondary: { color: '#fff', fontWeight: '700', fontSize: 14 },

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
    gap: 12,
  },
  menuItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  menuIconBg: {
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  menuEmoji: {},
  menuText: {
    color: '#f1f5f9',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
