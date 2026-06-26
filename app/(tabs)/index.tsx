import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
  StatusBar,
  useWindowDimensions,
  RefreshControl,
  Image,
  Animated,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import TestimonialCard from '../../components/TestimonialCard';
import AnimatedCard from '../../components/AnimatedCard';

const WHATSAPP_NUMBER = '6281234567890';

const quickActions = [
  { icon: 'wallet-outline', label: 'Booking', route: '/cars' },
  { icon: 'paper-plane-outline', label: 'WhatsApp', action: 'wa' },
  { icon: 'pricetag-outline', label: 'Promo', action: 'promo' },
  { icon: 'time-outline', label: 'Riwayat', route: '/history' },
];

const paymentList = [
  { icon: 'car-sport', label: 'Harian', route: '/cars', color: '#ef4444' },
  { icon: 'key', label: 'Lepas Kunci', route: '/cars', color: '#f59e0b' },
  { icon: 'person', label: 'Plus Sopir', route: '/cars', color: '#10b981' },
  { icon: 'map', label: 'Luar Kota', route: '/wilayah', color: '#3b82f6' },
  { icon: 'heart', label: 'Wedding', route: '/cars', color: '#ec4899' },
  { icon: 'business', label: 'Bulanan', route: '/cars', color: '#8b5cf6' },
  { icon: 'shield-checkmark', label: 'Asuransi', route: '/tentang', color: '#06b6d4' },
  { icon: 'grid', label: 'Semua Unit', route: '/cars', color: '#a855f7' },
];

const PROMO_CARS_FALLBACK = [
  {
    id: 'promo-1',
    name: 'Agya / Ayla 1.2 GR',
    brand: 'Toyota',
    price: 250000,
    transmission: 'Automatic',
    passengers: 5,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'promo-2',
    name: 'Brio Satya E CVT',
    brand: 'Honda',
    price: 275000,
    transmission: 'Automatic',
    passengers: 5,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'promo-3',
    name: 'Avanza / Xenia Facelift',
    brand: 'Toyota',
    price: 300000,
    transmission: 'Manual / AT',
    passengers: 7,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Member');
  const [promoCars, setPromoCars] = useState<any[]>(PROMO_CARS_FALLBACK);
  const isSmall = SCREEN_W < 375;

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const promoRef = React.useRef<FlatList>(null);
  const promoIndexRef = React.useRef(0);
  const isPausedRef = React.useRef(false);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 160],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerTextScale = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerTextOpacity = scrollY.interpolate({
    inputRange: [0, 110],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const stickyBarOpacity = scrollY.interpolate({
    inputRange: [60, 130],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const loadTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').limit(6);
    if (data && data.length > 0) setTestimonials(data);
    setTestimonialsLoading(false);
  };

  const loadUserData = async () => {
    try {
      const savedAvatar = await AsyncStorage.getItem('user_avatar');
      if (savedAvatar) setAvatarUrl(savedAvatar);
      const savedName = await AsyncStorage.getItem('user_full_name');
      if (savedName) setUserName(savedName);

      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        if (data.user.user_metadata?.full_name) setUserName(data.user.user_metadata.full_name);
        if (data.user.user_metadata?.avatar_url && !savedAvatar) setAvatarUrl(data.user.user_metadata.avatar_url);
      }
    } catch (e) { }
  };

  const loadPromoCars = async () => {
    try {
      const { data } = await supabase.from('cars').select('*').order('price', { ascending: true }).limit(8);
      if (data && data.length > 0) setPromoCars(data);
    } catch (e) { }
  };

  useEffect(() => {
    loadTestimonials();
    loadUserData();
    loadPromoCars();
  }, []);

  useEffect(() => {
    if (promoCars.length <= 1) return;
    const timer = setInterval(() => {
      if (isPausedRef.current) return;
      promoIndexRef.current = (promoIndexRef.current + 1) % promoCars.length;
      const cardWidth = isSmall ? 246 : 276;
      promoRef.current?.scrollToOffset({
        offset: promoIndexRef.current * cardWidth,
        animated: true,
      });
    }, 3200);
    return () => clearInterval(timer);
  }, [promoCars, isSmall]);

  const onRefresh = async () => {
    setRefreshing(true);
    promoIndexRef.current = 0;
    promoRef.current?.scrollToOffset({ offset: 0, animated: true });
    await loadUserData();
    await loadTestimonials();
    await loadPromoCars();
    setRefreshing(false);
  };

  const openWhatsApp = () => {
    const msg = 'Halo Car Auto Retail, saya ingin informasi tentang rental mobil Anda.';
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  const claimPromo = () => {
    const msg = 'Halo Car Auto Retail, saya ingin klaim promo penawaran spesial diskon 25%!';
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  const handleQuickAction = (item: any) => {
    if (item.action === 'wa') openWhatsApp();
    else if (item.action === 'promo') claimPromo();
    else if (item.route) router.push(item.route);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#881337" />

      {/* Sticky Animated Glass Top Bar */}
      <Animated.View style={[styles.stickyBar, { opacity: stickyBarOpacity }]}>
        <ImageBackground source={require('../../assets/logo.jpg')} style={styles.stickyBarBg}>
          <View style={styles.stickyBarOverlay} />
          <SafeAreaView edges={['top']} style={styles.stickyBarContent}>
            <TouchableOpacity style={styles.avatarWrapSmall} onPress={() => router.push('/akun')}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Ionicons name="person" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.stickyTitleRow}>
              {/* <Image source={require('../../assets/logo.jpg')} style={styles.stickyMiniLogo} resizeMode="cover" /> */}
              <Text style={styles.stickyBarTitle}>Car Auto Retail</Text>
            </View>

            <TouchableOpacity style={styles.bellBtnSmall} onPress={() => router.push('/history')}>
              <Ionicons name="notifications" size={18} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ef4444" colors={['#ef4444']} />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Pilot Header ala Unicorn Mockup */}
        <Animated.View style={[styles.topHeaderWrap, { transform: [{ translateY: headerTranslateY }] }]}>
          <ImageBackground
            source={require('../../assets/logo.jpg')}
            style={styles.topHeaderBg}
            imageStyle={styles.topHeaderBgImg}
          >
            <View style={styles.topHeaderOverlay} />
            <SafeAreaView edges={['top']} style={styles.topHeaderContent}>
              <View style={styles.pilotNavRow}>
                <View style={styles.pilotLeftGroup}>
                  <TouchableOpacity style={styles.pilotPinCircle} activeOpacity={0.8} onPress={() => router.push('/wilayah')}>
                    <Ionicons name="location" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.pilotLocLabel}>Lokasi Pilihan</Text>
                    <TouchableOpacity style={styles.pilotLocValRow} onPress={() => router.push('/wilayah')} activeOpacity={0.8}>
                      <Text style={styles.pilotLocValText}>Jawa Barat, ID</Text>
                      <Ionicons name="chevron-down" size={16} color="#fbbf24" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.avatarWrap} onPress={() => router.push('/akun')} activeOpacity={0.8}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Ionicons name="person" size={20} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <Animated.View style={[styles.balanceCenterWrap, { opacity: headerTextOpacity, transform: [{ scale: headerTextScale }] }]}>
                <Text style={styles.balanceLabel}>Pusat Rental Mobil Eksekutif</Text>
                <Text style={[styles.balanceValue, isSmall && { fontSize: 32 }]}>Car Auto Retail</Text>
              </Animated.View>
            </SafeAreaView>
          </ImageBackground>
        </Animated.View>

        {/* Main Body Overlapping Curved Sheet */}
        <View style={styles.unicornSheet}>
          <View style={styles.dragHandlePill} />

          {/* Search Pill */}
          <TouchableOpacity style={styles.mockupSearchPill} onPress={() => router.push('/cars')} activeOpacity={0.9}>
            <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 10 }} />
            <Text style={styles.mockupSearchText}>Cari kendaraan impian Anda...</Text>
          </TouchableOpacity>

          {/* Hero Featured Card (Top Chart of the Day) */}
          <View style={styles.heroPromoBox}>
            <ImageBackground source={require('../../assets/logo.jpg')} style={styles.heroPromoBg} imageStyle={{ borderRadius: 24 }}>
              <View style={styles.heroPromoOverlay} />
              <View style={styles.heroPromoInner}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.heroPromoChartText}>TOP CHART OF THE DAY</Text>
                  <Text style={styles.heroPromoBigTitle}>Sewa Mobil VIP & Lepas Kunci Jabar</Text>
                  <TouchableOpacity style={styles.yellowMockupBtn} onPress={claimPromo} activeOpacity={0.8}>
                    <Ionicons name="play" size={16} color="#0f172a" style={{ marginRight: 6 }} />
                    <Text style={styles.yellowMockupBtnText}>Pesan Sekarang</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.heroCarFloatWrap}>
                  <Ionicons name="car-sport" size={isSmall ? 68 : 82} color="#ffffff" style={styles.carNeonGlow} />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Floating Quick Action Row */}
          <View style={styles.quickActionSheetRow}>
            {quickActions.map((qa, i) => (
              <TouchableOpacity
                key={qa.label}
                style={styles.quickActionItem}
                onPress={() => handleQuickAction(qa)}
                activeOpacity={0.75}
              >
                <View style={styles.quickActionIconCircle}>
                  <Ionicons name={qa.icon as any} size={22} color="#ef4444" />
                </View>
                <Text style={styles.quickActionText}>{qa.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Top Brands Grid */}
          <View style={styles.brandsHeaderRow}>
            <Text style={styles.sectionTitle}>Top Brands</Text>
            <TouchableOpacity onPress={() => router.push('/cars')}>
              <Text style={styles.seeMoreText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.brandsGrid}>
            {paymentList.map((item, index) => (
              <AnimatedCard
                key={item.label}
                delay={index * 50}
                style={[styles.brandChip, { width: isSmall ? '23%' : '22%' }]}
                onPress={() => router.push('/cars')}
              >
                <View style={styles.brandIconBox}>
                  <Ionicons name={item.icon as any} size={26} color={item.color} />
                </View>
                <Text style={styles.brandLabel} numberOfLines={1}>
                  {item.label}
                </Text>
              </AnimatedCard>
            ))}
          </View>

          {/* Identify Closest Vehicle Map Banner */}
          <TouchableOpacity style={styles.mapBannerCard} onPress={() => router.push('/wilayah')} activeOpacity={0.85}>
            <View style={styles.mapGraphicBox}>
              <Ionicons name="map" size={42} color="#3b82f6" />
              <View style={styles.mapPinOverlay}>
                <Ionicons name="location" size={22} color="#ef4444" />
              </View>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 14 }}>
              <Text style={styles.mapBannerTitle}>Temukan Unit Terdekat</Text>
              <Text style={styles.mapBannerSub}>Deteksi armada terdekat di Jawa Barat</Text>
            </View>
            <View style={styles.mapArrowCircle}>
              <Ionicons name="chevron-forward" size={18} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Promo & Penawaran */}
          <View style={styles.promoHeaderRow}>
            <Text style={styles.sectionTitle}>Armada Pilihan Terpopuler</Text>
            <TouchableOpacity onPress={() => router.push('/cars')} activeOpacity={0.7}>
              <Text style={styles.seeMoreText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.promoSliderWrap}>
            <FlatList
              ref={promoRef}
              data={promoCars}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, i) => item.id || String(i)}
              contentContainerStyle={{ gap: 16, paddingRight: 20 }}
              snapToInterval={isSmall ? 246 : 276}
              decelerationRate="fast"
              getItemLayout={(_, index) => {
                const cardWidth = isSmall ? 246 : 276;
                return { length: cardWidth, offset: cardWidth * index, index };
              }}
              onScrollToIndexFailed={(info) => {
                const cardWidth = isSmall ? 246 : 276;
                promoRef.current?.scrollToOffset({ offset: info.index * cardWidth, animated: true });
              }}
              onTouchStart={() => {
                isPausedRef.current = true;
              }}
              onScrollBeginDrag={() => {
                isPausedRef.current = true;
              }}
              onScrollEndDrag={() => {
                setTimeout(() => {
                  isPausedRef.current = false;
                }, 2000);
              }}
              onMomentumScrollEnd={(e) => {
                const offsetX = e.nativeEvent.contentOffset.x;
                const cardWidth = isSmall ? 246 : 276;
                const newIndex = Math.round(offsetX / cardWidth);
                if (newIndex >= 0 && newIndex < promoCars.length) {
                  promoIndexRef.current = newIndex;
                }
                setTimeout(() => {
                  isPausedRef.current = false;
                }, 2000);
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.promoSliderCard, { width: isSmall ? 230 : 260 }]}
                  onPress={() => router.push('/cars')}
                >
                  <View style={styles.promoImgBox}>
                    <Image
                      source={{ uri: item.image || item.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80' }}
                      style={styles.promoImg}
                      resizeMode="cover"
                    />
                    <View style={styles.hotPromoBadge}>
                      <Ionicons name="flame" size={13} color="#fff" />
                      <Text style={styles.hotPromoText}>HOT PROMO</Text>
                    </View>
                  </View>

                  <View style={styles.promoCardBody}>
                    <Text style={styles.promoBrandText}>{item.brand || 'Toyota'}</Text>
                    <Text style={styles.promoCarName} numberOfLines={1}>{item.name || 'Unit Spesial'}</Text>

                    <View style={styles.promoSpecRow}>
                      <Ionicons name="cog" size={12} color="#94a3b8" />
                      <Text style={styles.promoSpecText}>{item.transmission || 'Automatic'}</Text>
                      <Text style={styles.promoSpecDot}>•</Text>
                      <Ionicons name="people" size={12} color="#94a3b8" />
                      <Text style={styles.promoSpecText}>{item.passengers || item.seat || 5} Kursi</Text>
                    </View>

                    <View style={styles.promoPriceRow}>
                      <View>
                        <Text style={styles.promoPriceLabel}>Mulai dari</Text>
                        <Text style={styles.promoPriceValue}>
                          Rp {Number(item.price || item.price_per_day || 250000).toLocaleString('id-ID')}
                          <Text style={styles.promoPricePer}> /hari</Text>
                        </Text>
                      </View>

                      <View style={styles.promoBookBtn}>
                        <Text style={styles.promoBookText}>Sewa</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Testimoni Pelanggan */}
          <View style={styles.testimonialContainer}>
            <Text style={styles.sectionTitle}>Testimoni Pelanggan</Text>
            {testimonialsLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 12 }}>Memuat testimoni...</Text>
              </View>
            ) : testimonials.length > 0 ? (
              <FlatList
                data={testimonials}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => <TestimonialCard item={item} />}
                contentContainerStyle={{ paddingRight: 20 }}
              />
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 12 }}>Belum ada testimoni</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
    fontFamily: 'Arial',
  },
  stickyBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#881337',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
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
    backgroundColor: 'rgba(136, 19, 55, 0.88)',
  },
  stickyBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  stickyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stickyMiniLogo: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  stickyBarTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '900',
  },
  avatarWrapSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    backgroundColor: '#9f1239',
  },
  bellBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderWrap: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#881337',
  },
  topHeaderBg: {
    width: '100%',
  },
  topHeaderBgImg: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  topHeaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(136, 19, 55, 0.82)',
  },
  topHeaderContent: {
    paddingHorizontal: 20,
    paddingBottom: 75,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    backgroundColor: '#9f1239',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCenterWrap: {
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#fecdd3',
    fontSize: 13,
    fontFamily: 'Arial',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 42,
    fontFamily: 'Arial',
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Floating Action Pill
  floatingActionContainer: {
    marginTop: -50,
    marginHorizontal: 20,
    zIndex: 20,
  },
  floatingActionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#f8fafc',
    fontSize: 12,
    fontFamily: 'Arial',
    fontWeight: '700',
  },

  // Body Sheet
  bodySheet: {
    marginTop: 18,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 16,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
    marginBottom: 28,
  },
  paymentItem: {
    alignItems: 'center',
  },
  paymentIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  paymentLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontFamily: 'Arial',
    fontWeight: '700',
    textAlign: 'center',
  },

  // Promo
  promoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeMoreText: {
    color: '#ef4444',
    fontSize: 13,
    fontFamily: 'Arial',
    fontWeight: '700',
  },
  promoWrap: {
    position: 'relative',
    marginBottom: 36,
    alignItems: 'center',
  },
  promoBannerCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    overflow: 'hidden',
  },
  promoBannerContent: {},
  promoBannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: '900',
    marginBottom: 8,
  },
  promoBannerSub: {
    color: '#94a3b8',
    fontSize: 13,
    fontFamily: 'Arial',
    lineHeight: 20,
    maxWidth: '85%',
  },
  floatingCenterCircle: {
    position: 'absolute',
    bottom: -22,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#0a0f1e',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  // Promo Slider ala Permintaan User
  promoSliderWrap: {
    marginBottom: 28,
  },
  promoSliderCard: {
    backgroundColor: '#1e293b',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  promoImgBox: {
    height: 125,
    width: '100%',
    position: 'relative',
    backgroundColor: '#334155',
  },
  promoImg: {
    width: '100%',
    height: '100%',
  },
  hotPromoBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  hotPromoText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Arial',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoCardBody: {
    padding: 14,
  },
  promoBrandText: {
    color: '#ef4444',
    fontSize: 11,
    fontFamily: 'Arial',
    fontWeight: '700',
    marginBottom: 2,
  },
  promoCarName: {
    color: '#f8fafc',
    fontSize: 15,
    fontFamily: 'Arial',
    fontWeight: '800',
    marginBottom: 6,
  },
  promoSpecRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  promoSpecText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'Arial',
  },
  promoSpecDot: {
    color: '#64748b',
    fontSize: 11,
  },
  promoPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
  },
  promoPriceLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontFamily: 'Arial',
  },
  promoPriceValue: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '900',
  },
  modalTitleText: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  modalSubText: { fontSize: 14, color: '#64748b', textAlign: 'center', marginVertical: 12 },
  modalCloseBtn: { backgroundColor: '#dc2626', paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  modalCloseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Unicorn UI Styles
  pilotNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  pilotLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pilotPinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  pilotLocLabel: {
    fontSize: 12,
    color: '#fecdd3',
    fontFamily: 'Arial',
    fontWeight: '600',
  },
  pilotLocValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pilotLocValText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'Arial',
  },
  unicornSheet: {
    marginTop: -32,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#0a0f1e',
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  dragHandlePill: {
    width: 42,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#334155',
    alignSelf: 'center',
    marginVertical: 12,
    marginBottom: 18,
  },
  mockupSearchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 22,
    height: 50,
    paddingHorizontal: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mockupSearchText: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: 'Arial',
    fontWeight: '600',
  },
  heroPromoBox: {
    marginBottom: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  heroPromoBg: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroPromoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(76, 29, 149, 0.92)',
  },
  heroPromoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
  },
  heroPromoChartText: {
    fontSize: 11,
    color: '#e9d5ff',
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroPromoBigTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'Arial',
    lineHeight: 26,
    marginBottom: 16,
  },
  yellowMockupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#facc15',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: 'flex-start',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  yellowMockupBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
    fontFamily: 'Arial',
  },
  heroCarFloatWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -10,
  },
  carNeonGlow: {
    textShadowColor: '#ffffff',
    textShadowRadius: 15,
  },
  quickActionSheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginBottom: 28,
  },
  brandChip: {
    alignItems: 'center',
  },
  brandIconBox: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.2,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  brandLabel: {
    color: '#e2e8f0',
    fontSize: 12,
    fontFamily: 'Arial',
    fontWeight: '700',
  },
  mapBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 22,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  mapGraphicBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapPinOverlay: {
    position: 'absolute',
  },
  mapBannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'Arial',
  },
  mapBannerSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 3,
    fontFamily: 'Arial',
  },
  mapArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6d28d9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  promoPricePer: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  promoBookBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  promoBookText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Arial',
    fontWeight: '800',
  },

  // Testimonial
  testimonialContainer: {
    marginTop: 10,
  },
});
