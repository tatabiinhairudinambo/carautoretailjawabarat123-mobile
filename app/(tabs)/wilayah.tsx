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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" colors={['#ffffff']} />}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleWrap}>
              {/* <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeDot}>●</Text>
                <Text style={styles.headerBadgeText}>JARINGAN RESMI JAWA BARAT</Text>
              </View> */}
              <Text style={[styles.title, isSmall && { fontSize: 22 }]}>Wilayah Layanan</Text>
            </View>
            {/* <View style={styles.headerIconWrap}>
              <Ionicons name="map" size={24} color="#ef4444" />
            </View> */}
          </View>

          <Text style={[styles.subtitle, isSmall && { fontSize: 12 }]}>
            Pilih area tujuan perjalanan Anda untuk cek ketersediaan armada & booking langsung via WhatsApp.
          </Text>

          {/* Trust Info Bar */}
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
  header: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 18,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  headerTitleWrap: { flex: 1 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.35)', marginBottom: 8,
  },
  headerBadgeDot: { color: '#ef4444', fontSize: 8 },
  headerBadgeText: { fontSize: 9, fontWeight: '800', color: '#fca5a5', letterSpacing: 0.5 },
  headerIconWrap: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#1e293b',
    borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 26, fontWeight: '900', color: '#ffffff', letterSpacing: 0.3, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#ffffff', marginTop: 4, lineHeight: 20, marginBottom: 16, textAlign: 'center' },
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
