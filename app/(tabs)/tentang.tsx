import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function TentangScreen() {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 520, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Tentang Kami</Text>
            <Text style={styles.subtitle}>Mitra perjalanan terpercaya Anda</Text>
          </View>

          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoImgWrap}>
                <Image
                  source={require('../../assets/logo.jpg')}
                  style={styles.logoImg}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.companyName}>Car Auto Garage</Text>
              <Text style={styles.companyTagline}>Jawa Barat</Text>
              <View style={styles.taglineBar} />
            </View>

            {/* Siapa Kami */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="information-circle" size={20} color="#dc2626" />
                <Text style={styles.sectionTitle}>Siapa Kami</Text>
              </View>
              <Text style={styles.sectionText}>
                Kami adalah penyedia layanan rental mobil terpercaya di Jawa Barat. Berkomitmen memberikan pengalaman perjalanan terbaik dengan armada yang terawat dan harga yang transparan.
              </Text>
            </View>

            {/* Visi */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="eye" size={20} color="#3b82f6" />
                <Text style={styles.sectionTitle}>Visi</Text>
              </View>
              <Text style={styles.sectionText}>
                Menjadi penyedia layanan rental mobil terdepan di Jawa Barat dengan pelayanan profesional dan harga terjangkau.
              </Text>
            </View>

            {/* Misi */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="rocket" size={20} color="#f59e0b" />
                <Text style={styles.sectionTitle}>Misi</Text>
              </View>
              <Text style={styles.sectionText}>
                • Menyediakan armada berkualitas dan terawat{'\n'}
                • Memberikan pelayanan cepat dan ramah{'\n'}
                • Harga transparan tanpa biaya tersembunyi{'\n'}
                • Kemudahan booking dan pengembalian
              </Text>
            </View>

            {/* Values */}
            <View style={styles.valuesRow}>
              <View style={styles.valueCard}>
                <Ionicons name="star" size={32} color="#fcd34d" style={{ marginBottom: 8 }} />
                <Text style={styles.valueLabel}>Terpercaya</Text>
              </View>
              <View style={styles.valueCard}>
                <Ionicons name="people" size={32} color="#60a5fa" style={{ marginBottom: 8 }} />
                <Text style={styles.valueLabel}>Profesional</Text>
              </View>
              <View style={styles.valueCard}>
                <Ionicons name="pricetag" size={32} color="#4ade80" style={{ marginBottom: 8 }} />
                <Text style={styles.valueLabel}>Terjangkau</Text>
              </View>
            </View>

          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#f1f5f9' },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 4 },
  content: { padding: 20 },

  logoSection: {
    alignItems: 'center', marginBottom: 28,
    backgroundColor: '#1e293b', borderRadius: 24, padding: 28,
    borderWidth: 1, borderColor: '#334155',
  },
  logoImgWrap: {
    width: 96, height: 96, borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(220,38,38,0.5)',
    marginBottom: 16,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  logoImg: { width: '100%', height: '100%' },
  companyName: { fontSize: 22, fontWeight: '900', color: '#f1f5f9', marginBottom: 4 },
  companyTagline: { fontSize: 13, color: '#fbbf24', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  taglineBar: {
    width: 40, height: 3, borderRadius: 2,
    backgroundColor: '#dc2626', marginTop: 12,
  },

  section: { marginBottom: 22 },
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#f1f5f9' },
  sectionText: {
    fontSize: 14, color: '#94a3b8', lineHeight: 22,
    backgroundColor: '#1e293b', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#334155',
  },

  valuesRow: {
    flexDirection: 'row', gap: 10,
    backgroundColor: '#1e293b', borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: '#334155',
  },
  valueCard: { flex: 1, alignItems: 'center' },
  valueLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
});
