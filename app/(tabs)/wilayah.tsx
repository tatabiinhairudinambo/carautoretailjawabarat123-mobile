import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
  TouchableOpacity, Linking, RefreshControl, useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCard from '../../components/AnimatedCard';

const WHATSAPP_NUMBER = '6281234567890';

const regions = [
  {
    icon: 'business',
    name: 'Bandung Raya',
    desc: 'Kota Bandung, Cimahi, Kab. Bandung, Bandung Barat',
    badge: 'Layanan Utama',
    image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: 'map',
    name: 'Jakarta & Jabodetabek',
    desc: 'Jakarta, Bekasi, Depok, Tangerang, Bogor',
    badge: 'Express 24 Jam',
    image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: 'trail-sign',
    name: 'Priangan Timur',
    desc: 'Garut, Tasikmalaya, Ciamis, Pangandaran',
    badge: 'Unit Ready',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: 'water',
    name: 'Cirebon Raya',
    desc: 'Cirebon, Indramayu, Majalengka, Kuningan',
    badge: 'Antar Jemput',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: 'leaf',
    name: 'Sukabumi Raya',
    desc: 'Sukabumi, Cianjur',
    badge: 'Fast Booking',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: 'pin',
    name: 'Karawang & Purwakarta',
    desc: 'Karawang, Purwakarta, Subang',
    badge: 'Support 24/7',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
  },
];

export default function WilayahScreen() {
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleBookRegion = (regionName: string) => {
    const msg = `Halo Car Auto Retail, saya ingin memesan layanan rental mobil untuk area ${regionName}.`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

      {/* Fixed Hero Red Burgundy Glass Header */}
      <ImageBackground source={require('../../assets/logo.jpg')} style={styles.headerBg} imageStyle={styles.headerBgImg}>
        <View style={styles.headerOverlay} />

        <View style={[styles.headerHeroTextWrap, isSmall && { paddingHorizontal: 16, paddingBottom: 12 }]}>
          <Text style={styles.locSubtitle}>JARINGAN SHOWROOM VIP</Text>
          <Text style={styles.heroBigTitle}>Wilayah Layanan Resmi</Text>
          <Text style={styles.heroSubText}>Jangkauan ekspres 24 jam di seluruh kota & kabupaten Jawa Barat</Text>
        </View>
      </ImageBackground>

      {/* Fixed Trust Info Bar */}
      <View style={{ paddingHorizontal: 16, marginTop: 14, marginBottom: 6 }}>
        <View style={styles.trustBar}>
          <View style={styles.trustItem}>
            <Ionicons name="checkmark-circle" size={15} color="#10b981" />
            <Text style={styles.trustText}>Ready 24 Jam</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={15} color="#3b82f6" />
            <Text style={styles.trustText}>Asuransi All-Risk</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <Ionicons name="flash" size={15} color="#f59e0b" />
            <Text style={styles.trustText}>Fast Booking</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ef4444" colors={['#ef4444']} />}
        contentContainerStyle={{ paddingBottom: 110, paddingTop: 6 }}
      >
        <View style={[styles.grid, isSmall && { padding: 12 }]}>
          {regions.map((r, idx) => (
            <AnimatedCard
              key={r.name}
              delay={idx * 110}
              style={[styles.cardWrap, { width: isSmall ? '100%' : '48%' }]}
              onPress={() => handleBookRegion(r.name)}
            >
              <ImageBackground source={{ uri: r.image }} style={styles.cardBg} imageStyle={styles.cardImage}>
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconBg}>
                      <Ionicons name={r.icon as any} size={20} color="#ef4444" />
                    </View>
                    <Ionicons name="arrow-forward" size={18} color="#ef4444" />
                  </View>

                  <Text style={styles.cardName} numberOfLines={1}>{r.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{r.desc}</Text>

                  <View style={styles.badgeWrap}>
                    <Text style={styles.badgeText} numberOfLines={1}>{r.badge}</Text>
                  </View>
                </View>
              </ImageBackground>
            </AnimatedCard>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  headerBg: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 22,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#ff1a3c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  headerBgImg: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(88, 19, 55, 0.92)',
  },
  headerHeroTextWrap: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    alignItems: 'center',
  },
  locSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fca5a5',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroBigTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  heroSubText: {
    fontSize: 12,
    color: '#f8fafc',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  trustBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: '#1e293b', paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 14, borderWidth: 1, borderColor: '#334155',
  },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trustText: { fontSize: 11, fontWeight: '700', color: '#f1f5f9' },
  trustDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#475569' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 16, rowGap: 16 },
  cardWrap: {
    borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#334155',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  cardBg: { width: '100%' },
  cardImage: { borderRadius: 18 },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
  },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239,68,68,0.15)' },
  cardName: { fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  cardDesc: { fontSize: 12, color: '#ffffff', lineHeight: 18, marginBottom: 14, minHeight: 36, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  badgeWrap: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.3)' },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#ffffff' },
});
