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
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Semua');

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    const { data } = await supabase.from('cars').select('*').order('featured', { ascending: false });
    if (data) setCars(data);
    setLoading(false);
  };

  const filtered = cars.filter((c) => {
    const matchBrand = selectedBrand === 'Semua' || c.brand === selectedBrand;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

      {/* Header */}
      <View style={[styles.header, isSmall && { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }]}>
        <View>
          <Text style={[styles.title, isSmall && { fontSize: 20 }]}>Armada Kami</Text>
          <Text style={[styles.subtitle, isSmall && { fontSize: 12 }]}>{filtered.length} unit tersedia</Text>
        </View>
        <View style={[styles.headerBadge, isSmall && { width: 38, height: 38 }]}>
          <Ionicons name="car-sport" size={isSmall ? 20 : 24} color="#dc2626" />
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, isSmall && { marginHorizontal: 12, marginVertical: 8 }]}>
        <Ionicons name="search" size={18} color="#475569" style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, isSmall && { fontSize: 13, paddingVertical: 11 }]}
          placeholder="Cari nama mobil..."
          placeholderTextColor="#475569"
          value={search}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#475569" />
          </TouchableOpacity>
        )}
      </View>

      {/* Brand Filter */}
      <FlatList
        data={BRANDS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={[styles.filterList, isSmall && { paddingHorizontal: 12, gap: 6 }]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, selectedBrand === item && styles.filterChipActive, isSmall && { paddingHorizontal: 14, paddingVertical: 7 }]}
            onPress={() => setSelectedBrand(item)}
          >
            <Text style={[styles.filterText, selectedBrand === item && styles.filterTextActive, isSmall && { fontSize: 12 }]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#f1f5f9', letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 3, fontWeight: '600' },
  headerBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  headerBadgeText: { fontSize: 22 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1e293b', marginHorizontal: 16, marginVertical: 12,
    borderRadius: 16, borderWidth: 1, borderColor: '#334155',
    paddingHorizontal: 14, paddingVertical: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#f1f5f9', paddingVertical: 13 },

  filterList: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22,
    backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155',
  },
  filterChipActive: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterTextActive: { color: '#fff' },

  list: { paddingHorizontal: 16, paddingBottom: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { color: '#475569', marginTop: 12, fontSize: 14 },
  emptyText: { color: '#475569', fontSize: 15, marginTop: 12, textAlign: 'center' },
});
