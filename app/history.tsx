import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, RefreshControl, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import PageLoader from '../components/PageLoader';

interface Order {
  id: string;
  car_name: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

const statusConfig = {
  active: { label: 'Aktif', color: '#16a34a', bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.25)' },
  completed: { label: 'Selesai', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
  cancelled: { label: 'Dibatalkan', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
};

const formatPrice = (price: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(price);

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function HistoryScreen() {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [minLoadDone, setMinLoadDone] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
    const t = setTimeout(() => setMinLoadDone(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#dc2626" colors={['#dc2626']} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.title}>Riwayat Pemesanan</Text>
          <View style={{ width: 40 }} />
        </View>

        {!(loading || !minLoadDone) && orders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={48} color="#334155" />
            </View>
            <Text style={styles.emptyTitle}>Belum Ada Pemesanan</Text>
            <Text style={styles.emptyDesc}>
              Anda belum memiliki riwayat pemesanan. Jelajahi armada kami dan lakukan pemesanan pertama Anda!
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/(tabs)/cars')} activeOpacity={0.85}>
              <Ionicons name="car-sport" size={18} color="#fff" />
              <Text style={styles.emptyButtonText}>Lihat Armada</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {orders.map((order) => {
              const cfg = statusConfig[order.status];
              return (
                <View key={order.id} style={[styles.card, isSmall && { padding: 14 }]}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.carName, isSmall && { fontSize: 15 }]}>{order.car_name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                      <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
                      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>

                  <View style={[styles.cardBody, isSmall && { gap: 10 }]}>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={16} color="#64748b" />
                      <Text style={[styles.infoText, isSmall && { fontSize: 12 }]}>
                        {formatDate(order.start_date)} - {formatDate(order.end_date)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="cash-outline" size={16} color="#64748b" />
                      <Text style={[styles.infoText, isSmall && { fontSize: 12 }]}>{formatPrice(order.total_price)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={16} color="#64748b" />
                      <Text style={[styles.infoText, isSmall && { fontSize: 12 }]}>Dipesan {formatDate(order.created_at)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Full-screen page loader overlay */}
      {(loading || !minLoadDone) && <PageLoader text="Memuat riwayat..." />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: '#f1f5f9' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 60 },
  loadingText: { color: '#cbd5e1', marginTop: 12, fontSize: 14 },

  // Empty
  emptyWrap: { alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#f1f5f9', marginBottom: 12 },
  emptyDesc: { fontSize: 13, color: '#cbd5e1', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  emptyButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#dc2626', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16,
    shadowColor: '#dc2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  emptyButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // List
  list: { padding: 16, gap: 14 },

  // Card
  card: {
    backgroundColor: '#1e293b', borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: '#334155',
  },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#334155',
  },
  carName: { fontSize: 17, fontWeight: '800', color: '#f1f5f9', flex: 1, marginRight: 12 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardBody: { gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 13, color: '#cbd5e1', flex: 1 },
});
