import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Image, Linking, useWindowDimensions, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import PageLoader from '../components/PageLoader';

const WHATSAPP_NUMBER = '6281234567890';

const PAYMENT_METHODS = [
  { id: 'bca', name: 'BCA Virtual Account', icon: 'business-outline' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', icon: 'business-outline' },
  { id: 'gopay', name: 'GoPay', icon: 'wallet-outline' },
  { id: 'qris', name: 'QRIS', icon: 'qr-code-outline' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [minLoadDone, setMinLoadDone] = useState(false);
  const [days, setDays] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('bca');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'instruction'>('select');
  const [virtualAccount, setVirtualAccount] = useState('');

  useEffect(() => {
    if (id && id !== '') loadCar();
    else setLoading(false);
    const t = setTimeout(() => setMinLoadDone(true), 5000);
    return () => clearTimeout(t);
  }, [id]);

  const loadCar = async () => {
    const { data } = await supabase.from('cars').select('*').eq('id', id);
    if (data && data.length > 0) setCar(data[0]);
    setLoading(false);
  };

  const formatPrice = (price: number) =>
    'Rp ' + new Intl.NumberFormat('id-ID').format(price);

  const getSubtotal = () => {
    const d = parseInt(days) || 1;
    return (car?.price || 0) * d;
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate generating VA
      const randomVA = '88000' + Math.floor(Math.random() * 100000000);
      setVirtualAccount(randomVA);
      setIsProcessing(false);
      setPaymentStep('instruction');
    }, 1200);
  };

  const handleConfirmWhatsApp = () => {
    if (!car) return;
    const method = PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name;
    const d = parseInt(days) || 1;
    const total = formatPrice(getSubtotal());
    
    const msg = `Halo Admin, saya ingin konfirmasi pembayaran sewa mobil:
- Armada: ${car.name} (${car.year})
- Durasi: ${d} Hari
- Total: ${total}
- Metode: ${method}
- VA/Kode: ${virtualAccount}

Mohon panduannya untuk proses verifikasi. Terima kasih!`;
    
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };

  if (loading || !minLoadDone) {
    return (
      <View style={styles.container}>
        <PageLoader text="Memuat pembayaran..." />
      </View>
    );
  }

  if (!car) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.title}>Pembayaran</Text>
        </View>
        <View style={styles.center}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Armada tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.title}>Detail Pembayaran</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Car Summary */}
        <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/car-detail', params: { id: car.id } })} activeOpacity={0.85}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Image source={{ uri: car.image }} style={styles.carImg} borderRadius={12} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carBrand}>{car.brand} • {car.year}</Text>
              <Text style={styles.carPrice}>{formatPrice(car.price)} <Text style={styles.carPriceSub}>/ hari</Text></Text>
            </View>
          </View>
        </TouchableOpacity>

        {paymentStep === 'select' ? (
          <>
            {/* Input Days */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Durasi Sewa (Hari)</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="time-outline" size={20} color="#64748b" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  keyboardType="default"
                  value={days}
                  onChangeText={setDays}
                  placeholder="Berapa hari?"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
              <View style={styles.methodsWrap}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      activeOpacity={0.7}
                      style={[styles.methodCard, isSelected && styles.methodCardActive]}
                      onPress={() => setPaymentMethod(method.id)}
                    >
                      <Ionicons name={method.icon as any} size={24} color={isSelected ? '#ef4444' : '#cbd5e1'} />
                      <Text style={[styles.methodText, isSelected && styles.methodTextActive]}>
                        {method.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={22} color="#ef4444" style={{ marginLeft: 'auto' }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Summary */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryVal}>{formatPrice(getSubtotal())}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Biaya Layanan</Text>
                <Text style={styles.summaryVal}>Rp 0</Text>
              </View>
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 14, marginTop: 4 }]}>
                <Text style={[styles.summaryLabel, { color: '#f1f5f9', fontWeight: '700' }]}>Total Pembayaran</Text>
                <Text style={[styles.summaryVal, { color: '#fbbf24', fontSize: 18, fontWeight: '900' }]}>
                  {formatPrice(getSubtotal())}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.instructionCard}>
            <View style={styles.successIconWrap}>
              <Ionicons name="time" size={32} color="#fbbf24" />
            </View>
            <Text style={styles.instTitle}>Selesaikan Pembayaran</Text>
            <Text style={styles.instSub}>Transfer ke nomor Virtual Account di bawah ini sebelum batas waktu habis.</Text>
            
            <View style={styles.vaBox}>
              <Text style={styles.vaBank}>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</Text>
              <Text style={styles.vaNumber}>{virtualAccount}</Text>
              <Text style={styles.vaTotal}>Jumlah: {formatPrice(getSubtotal())}</Text>
            </View>
            
            <Text style={styles.instInfo}>Setelah Anda melakukan transfer, klik tombol di bawah untuk mengkonfirmasi ke admin melalui WhatsApp agar pesanan segera diproses.</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        {paymentStep === 'select' ? (
          <TouchableOpacity 
            style={[styles.primaryBtn, isProcessing && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={handleProcessPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#0a0f1e" />
            ) : (
              <Text style={styles.primaryBtnText}>Proses Pembayaran</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.waBtn} 
            activeOpacity={0.8}
            onPress={handleConfirmWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.waBtnText}>Konfirmasi ke Admin</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: '#fbbf24', marginLeft: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  scrollContent: { padding: 16, paddingBottom: 100 },

  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 14, marginBottom: 20 },
  carImg: { width: 90, height: 70, backgroundColor: '#0f172a' },
  carName: { fontSize: 16, fontWeight: '800', color: '#f1f5f9' },
  carBrand: { fontSize: 12, color: '#94a3b8', marginVertical: 4 },
  carPrice: { fontSize: 14, fontWeight: '700', color: '#fbbf24' },
  carPriceSub: { fontSize: 11, color: '#64748b', fontWeight: '500' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#f1f5f9', marginBottom: 12 },
  
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b',
    borderRadius: 14, paddingHorizontal: 16, height: 54,
    borderWidth: 1, borderColor: '#334155'
  },
  input: { flex: 1, color: '#f1f5f9', fontSize: 16, fontWeight: '600' },

  methodsWrap: { gap: 10 },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1e293b', padding: 16, borderRadius: 14,
    borderWidth: 1, borderColor: '#334155'
  },
  methodCardActive: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#ef4444'
  },
  methodText: { fontSize: 15, fontWeight: '600', color: '#cbd5e1' },
  methodTextActive: { color: '#ef4444', fontWeight: '800' },

  summaryBox: { backgroundColor: '#1e293b', padding: 18, borderRadius: 16, gap: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: '#94a3b8', fontSize: 14 },
  summaryVal: { color: '#f1f5f9', fontSize: 15, fontWeight: '600' },

  instructionCard: { backgroundColor: '#1e293b', padding: 24, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  successIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(251,191,36,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  instTitle: { fontSize: 20, fontWeight: '900', color: '#f1f5f9', marginBottom: 8, textAlign: 'center' },
  instSub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },
  
  vaBox: { width: '100%', backgroundColor: '#0f172a', borderRadius: 12, padding: 16, marginTop: 24, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  vaBank: { fontSize: 14, color: '#cbd5e1', fontWeight: '600', marginBottom: 6 },
  vaNumber: { fontSize: 28, fontWeight: '900', color: '#fbbf24', letterSpacing: 1 },
  vaTotal: { fontSize: 15, color: '#10b981', fontWeight: '700', marginTop: 10 },
  
  instInfo: { fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: 18 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#1e293b', padding: 16, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: '#334155'
  },
  primaryBtn: {
    backgroundColor: '#fbbf24', borderRadius: 14, height: 56,
    alignItems: 'center', justifyContent: 'center'
  },
  primaryBtnText: { color: '#0a0f1e', fontSize: 16, fontWeight: '800' },
  
  waBtn: {
    backgroundColor: '#16a34a', borderRadius: 14, height: 56,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10
  },
  waBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
});
