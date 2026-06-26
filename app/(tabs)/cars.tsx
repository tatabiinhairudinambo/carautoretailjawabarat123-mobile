import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import CarCard from '../../components/CarCard';

const BRANDS = ['Semua', 'Toyota', 'Daihatsu', 'Honda', 'Suzuki', 'Mitsubishi'];

export default function CarsScreen() {
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Semua');

  useEffect(() => {
    loadCars();
  }, []);

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

  const filtered = cars.filter((c) => {
    const brand = c?.brand || '';
    const name = c?.name || '';
    const matchBrand = selectedBrand === 'Semua' || brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

      {/* Hero Reference Mockup Header */}
      <ImageBackground source={require('../../assets/logo.jpg')} style={styles.headerBg} imageStyle={styles.headerBgImg}>
        <View style={styles.headerOverlay} />

        {/* Top Row: Location & Glass Notification Button */}
        <View style={[styles.topRow, isSmall && { paddingHorizontal: 16, paddingTop: 12 }]}>
          <View>
            <Text style={styles.locSubtitle}>Location</Text>
            <View style={styles.locTitleRow}>
              <Ionicons name="location" size={18} color="#fbbf24" style={{ marginRight: 6 }} />
              <Text style={styles.locTitleText}>Jawa Barat, ID</Text>
              <Ionicons name="chevron-down" size={16} color="#fbbf24" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
            <Ionicons name="notifications" size={18} color="#ffffff" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Compact White Search Pill + Gold Filter Button */}
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

          <TouchableOpacity style={styles.filterBtnGold} activeOpacity={0.8}>
            <Ionicons name="options" size={18} color="#881337" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Brand Filter Outside Header */}
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

      {/* Cars List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>Memuat armada...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => <CarCard car={item} />}
          contentContainerStyle={isSmall ? { paddingHorizontal: 12, paddingBottom: 20 } : styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="car-outline" size={64} color="#334155" style={{ marginBottom: 16 }} />
              <Text style={styles.emptyText}>Tidak ada mobil ditemukan</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  headerBg: {
    width: '100%',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#881337',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  headerBgImg: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(136, 19, 55, 0.88)',
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
});
