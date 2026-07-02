import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  Animated,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import * as Location from 'expo-location';
import CarCard from '../../components/CarCard';
import PageLoader from '../../components/PageLoader';
import { isSmall, SCREEN_W, scaleFont } from '../../lib/responsive';

const BRANDS = ['Semua', 'Toyota', 'Daihatsu', 'Honda', 'Suzuki', 'Mitsubishi'];
const TRANSMISSIONS = ['Semua', 'Manual', 'Otomatis'];
const PASSENGER_OPTIONS = ['Semua', '4 Kursi', '5 Kursi', '7 Kursi'];
const PRICE_RANGES = ['Semua', '< Rp 500rb', 'Rp 500rb - Rp 1jt', '> Rp 1jt'];
const SORT_OPTIONS = ['Default', 'Harga Terendah', 'Harga Tertinggi', 'Tahun Terbaru'];

export default function CarsScreen() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadDone, setMinLoadDone] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Semua');
  const [selectedLoc, setSelectedLoc] = useState('Jawa Barat, ID');
  const [isLocating, setIsLocating] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filterTransmission, setFilterTransmission] = useState('Semua');
  const [filterPassengers, setFilterPassengers] = useState('Semua');
  const [filterPrice, setFilterPrice] = useState('Semua');
  const [sortBy, setSortBy] = useState('Default');

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
    loadCars();
    getCurrentLocation(false);
    const t = setTimeout(() => setMinLoadDone(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const getCurrentLocation = async (isUserInitiated = true) => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLocating(false);
        if (isUserInitiated) {
          Alert.alert('Izin Ditolak', 'Izinkan akses lokasi di pengaturan HP Anda untuk menggunakan fitur ini.');
        }
        return;
      }

      let location;
      try {
        location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      } catch (e) {
        location = await Location.getLastKnownPositionAsync({});
        if (!location) throw e;
      }

      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const locationName = `${place.city || place.subregion || place.region || 'Lokasi'}, ${place.isoCountryCode || 'ID'}`;
        setSelectedLoc(locationName);
      }
    } catch (error: any) {
      if (isUserInitiated) {
        const errMsg = error && error.message ? error.message : String(error);
        Alert.alert('Gagal Mendapatkan Lokasi', errMsg || 'Pastikan GPS (Lokasi) di HP Anda menyala.');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const loadCars = async () => {
    setLoading(true);
    const { data } = await supabase.from('cars').select('*');
    if (data) setCars(data);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const { data } = await supabase.from('cars').select('*');
    if (data) setCars(data);
    setRefreshing(false);
  };

  const activeFilterCount = [
    filterTransmission !== 'Semua',
    filterPassengers !== 'Semua',
    filterPrice !== 'Semua',
    sortBy !== 'Default',
  ].filter(Boolean).length;

  const filtered = cars
    .filter((c) => {
      if (selectedBrand !== 'Semua' && c.brand !== selectedBrand) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTransmission !== 'Semua' && c.transmission !== filterTransmission) return false;
      if (filterPassengers !== 'Semua') {
        const passCount = parseInt(filterPassengers.split(' ')[0], 10);
        if (c.passengers !== passCount) return false;
      }
      if (filterPrice === '< Rp 500rb' && c.price >= 500000) return false;
      if (filterPrice === 'Rp 500rb - Rp 1jt' && (c.price < 500000 || c.price > 1000000)) return false;
      if (filterPrice === '> Rp 1jt' && c.price <= 1000000) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Harga Terendah') return a.price - b.price;
      if (sortBy === 'Harga Tertinggi') return b.price - a.price;
      if (sortBy === 'Tahun Terbaru') return b.year - a.year;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  const resetFilters = useCallback(() => {
    setFilterTransmission('Semua');
    setFilterPassengers('Semua');
    setFilterPrice('Semua');
    setSortBy('Default');
    setSearch('');
    setSelectedBrand('Semua');
  }, []);

  const renderFilterSection = (title: string, options: string[], value: string, onSelect: (v: string) => void) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <View style={styles.filterOptionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.filterOptChip, value === opt && styles.filterOptChipActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterOptText, value === opt && styles.filterOptTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      <Animated.View style={[styles.headerWrap, { transform: [{ translateY: headerTranslateY }] }]}>
        <ImageBackground source={require('../../assets/logo.jpg')} style={styles.headerBg} imageStyle={styles.headerBgImg}>
          <View style={styles.headerOverlay} />

          <SafeAreaView edges={['top']} style={[styles.topRow, isSmall && { paddingHorizontal: 16, paddingTop: 12 }]}>
            <View>
              <Text style={styles.locSubtitle}>Location</Text>
              <TouchableOpacity onPress={() => getCurrentLocation(true)} style={styles.locTitleRow} activeOpacity={0.7}>
                <Ionicons name="location" size={18} color="#fbbf24" style={{ marginRight: 6 }} />
                <Text style={styles.locTitleText}>
                  {isLocating ? 'Mencari...' : selectedLoc}
                </Text>
                <Ionicons name="refresh" size={14} color="#fbbf24" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
              <Ionicons name="notifications" size={18} color="#ffffff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={[styles.searchRow, isSmall && { paddingHorizontal: 16, paddingBottom: 10 }]}>
            <View style={styles.searchPill}>
              <Ionicons name="search" size={15} color="#64748b" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.searchInputPill}
                placeholder="Cari armada..."
                placeholderTextColor="#94a3b8"
                value={search}
                onChangeText={setSearch}
              />
              {search !== '' && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.filterBtnGold}
              activeOpacity={0.8}
              onPress={() => setShowFilter(true)}
            >
              <Ionicons name="options" size={18} color="#881337" />
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Animated.View>

      <View style={{ flexGrow: 0, flexShrink: 0 }}>
        <FlatList
          data={BRANDS}
          horizontal
          style={{ flexGrow: 0 }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={[styles.filterList, isSmall && { paddingHorizontal: 12, gap: 8 }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedBrand === item && styles.filterChipActive,
                isSmall && { paddingHorizontal: 16, paddingVertical: 8, minWidth: 70 }
              ]}
              onPress={() => setSelectedBrand(item)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterText,
                selectedBrand === item && styles.filterTextActive,
                isSmall && { fontSize: 13 }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

      <Animated.View style={[styles.stickyBar, { opacity: stickyBarOpacity }]}>
        <ImageBackground source={require('../../assets/logo.jpg')} style={styles.stickyBarBg}>
          <View style={styles.stickyBarOverlay} />
          <SafeAreaView edges={['top']} style={styles.stickyBarContent}>
            <View style={styles.stickyTitleRow}>
              <Text style={styles.stickyBarTitle}>Armada VIP</Text>
              {activeFilterCount > 0 && (
                <View style={styles.stickyFilterBadge}>
                  <Text style={styles.stickyFilterBadgeText}>{activeFilterCount} filter</Text>
                </View>
              )}
            </View>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>

      {(loading || !minLoadDone) ? (
        <PageLoader text="Memuat armada..." />
      ) : (
        <Animated.FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <CarCard car={item} />}
          contentContainerStyle={isSmall ? { paddingHorizontal: 12, paddingBottom: 20 } : styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="car-outline" size={64} color="#334155" style={{ marginBottom: 16 }} />
              <Text style={styles.emptyText}>Tidak ada mobil ditemukan</Text>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters} activeOpacity={0.8}>
                <Ionicons name="refresh" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.resetBtnText}>Reset Filter</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Urutkan</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#cbd5e1" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {renderFilterSection('Transmisi', TRANSMISSIONS, filterTransmission, setFilterTransmission)}
              {renderFilterSection('Kapasitas', PASSENGER_OPTIONS, filterPassengers, setFilterPassengers)}
              {renderFilterSection('Rentang Harga', PRICE_RANGES, filterPrice, setFilterPrice)}
              {renderFilterSection('Urutkan', SORT_OPTIONS, sortBy, setSortBy)}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalResetBtn} onPress={resetFilters} activeOpacity={0.7}>
                <Text style={styles.modalResetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => setShowFilter(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalApplyText}>Terapkan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
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
  stickyBarBg: { width: '100%' },
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
    gap: 10,
  },
  stickyBarTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '900',
  },
  stickyFilterBadge: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stickyFilterBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  headerWrap: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#0a0f1e',
    marginBottom: 6,
  },
  headerBg: {
    width: '100%',
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
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
    backgroundColor: 'rgba(10, 15, 30, 0.88)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 14,
  },
  locSubtitle: {
    fontSize: 12,
    color: '#cbd5e1',
    fontFamily: 'Arial',
    fontWeight: '600',
  },
  locTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'Arial',
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#881337',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingBottom: 16,
    paddingTop: 2,
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 36,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputPill: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
    paddingVertical: 6,
    fontFamily: 'Arial',
    fontWeight: '600',
  },
  filterBtnGold: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fbbf24',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#881337',
  },
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  filterList: { paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 14, gap: 10 },
  filterChip: {
    paddingHorizontal: 22, paddingVertical: 10, borderRadius: 24, minWidth: 90,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1e293b', borderWidth: 1.5, borderColor: '#475569',
  },
  filterChipActive: {
    backgroundColor: '#dc2626',
    borderColor: '#ff4d4d',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  filterText: { fontSize: 14, fontWeight: '800', color: '#cbd5e1' },
  filterTextActive: { color: '#ffffff' },

  list: { paddingHorizontal: 16, paddingBottom: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { color: '#475569', marginTop: 12, fontSize: 14 },
  emptyText: { color: '#475569', fontSize: 15, marginTop: 12, textAlign: 'center' },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#f1f5f9',
  },
  modalBody: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fbbf24',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOptChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#475569',
  },
  filterOptChipActive: {
    backgroundColor: '#dc2626',
    borderColor: '#ff4d4d',
  },
  filterOptText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
  },
  filterOptTextActive: {
    color: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    marginTop: 8,
  },
  modalResetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
  },
  modalResetText: {
    color: '#cbd5e1',
    fontWeight: '800',
    fontSize: 14,
  },
  modalApplyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
  },
  modalApplyText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});
