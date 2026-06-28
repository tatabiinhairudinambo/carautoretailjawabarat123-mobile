import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BRAND_FALLBACK_IMAGES: Record<string, string> = {
  Toyota: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Toyota_Kijang_Innova_2.0_G_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2018_Indonesian_spec.jpg/640px-Toyota_Kijang_Innova_2.0_G_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2018_Indonesian_spec.jpg',
  Daihatsu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Daihatsu_Xenia_1.5_R_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/640px-Daihatsu_Xenia_1.5_R_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  Honda: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Honda_Mobilio_1.5_E_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/640px-Honda_Mobilio_1.5_E_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  Suzuki: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Suzuki_Ertiga_1.5_GX_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/640px-Suzuki_Ertiga_1.5_GX_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  Mitsubishi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Mitsubishi_Xpander_1.5_Exceed_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/640px-Mitsubishi_Xpander_1.5_Exceed_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
};

interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  transmission: string;
  price: number;
  condition: string;
  image: string;
  passengers: number;
  features: string[];
}

interface CarCardProps {
  car: Car;
}

const WHATSAPP_NUMBER = '6281234567890';

export default function CarCard({ car }: CarCardProps) {
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const [imgError, setImgError] = React.useState(false);
  const imageUri = (!car?.image || car.image === '' || imgError)
    ? (BRAND_FALLBACK_IMAGES[car?.brand] || BRAND_FALLBACK_IMAGES['Toyota'])
    : car.image;

  const handlePayment = (e: any) => {
    e.stopPropagation(); // prevent card click
    router.push(`/payment?id=${car.id}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID').format(price || 0);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/car-detail', params: { id: car.id } })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { height: isSmall ? 160 : 200 }]}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
        <View style={styles.imageOverlay} />
      </View>

      <View style={[styles.body, isSmall && { padding: 14 }]}>
        <Text style={[styles.name, isSmall && { fontSize: 16 }]}>{car.name}</Text>
        <Text style={[styles.brand, isSmall && { fontSize: 12 }]}>{car.brand}</Text>

        <View style={[styles.infoRow, isSmall && { padding: 10 }]}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#cbd5e1" />
            <Text style={[styles.infoText, isSmall && { fontSize: 11 }]}>{car.year}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Ionicons name="settings-outline" size={16} color="#cbd5e1" />
            <Text style={[styles.infoText, isSmall && { fontSize: 11 }]}>{car.transmission}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color="#cbd5e1" />
            <Text style={[styles.infoText, isSmall && { fontSize: 11 }]}>{car.passengers} Kursi</Text>
          </View>
        </View>

        <View style={styles.chipsRow}>
          <View style={[styles.chip, car.condition === 'Baru' ? styles.chipNew : styles.chipUsed]}>
            <Text style={[styles.chipText, car.condition === 'Baru' ? styles.chipNewText : styles.chipUsedText]}>
              {car.condition === 'Baru' ? 'Baru' : 'Bekas'}
            </Text>
          </View>
          <View style={styles.featuresRow}>
            {car.features?.slice(0, 2).map((f, i) => (
              <View key={i} style={styles.featureChip}>
                <Text style={[styles.featureText, isSmall && { fontSize: 10 }]}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Sewa per hari</Text>
            <Text style={[styles.price, isSmall && { fontSize: 16 }]}>Rp {formatPrice(car.price)}</Text>
          </View>
          <TouchableOpacity style={[styles.payButton, isSmall && { paddingHorizontal: 16, paddingVertical: 10 }]} onPress={handlePayment} activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="card-outline" size={isSmall ? 14 : 16} color="#0a0f1e" />
              <Text style={[styles.payText, isSmall && { fontSize: 12 }]}>Pesan</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#0f172a',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,15,30,0.3)',
  },
  body: { padding: 18 },
  name: { fontSize: 18, fontWeight: '900', color: '#f1f5f9', marginBottom: 3 },
  brand: { fontSize: 13, color: '#cbd5e1', fontWeight: '600', marginBottom: 14 },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    backgroundColor: '#0f172a', borderRadius: 12, padding: 12,
  },
  infoItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  separator: { width: 1, height: 20, backgroundColor: '#334155' },
  infoText: { fontSize: 12, color: '#cbd5e1', fontWeight: '600' },
  chipsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  chipNew: { backgroundColor: 'rgba(22,163,74,0.12)', borderColor: 'rgba(22,163,74,0.25)' },
  chipUsed: { backgroundColor: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.25)' },
  chipText: { fontSize: 11, fontWeight: '700' },
  chipNewText: { color: '#16a34a' },
  chipUsedText: { color: '#f87171' },
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  featureChip: {
    backgroundColor: 'rgba(220,38,38,0.12)',
    borderColor: 'rgba(220,38,38,0.25)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureText: { fontSize: 11, color: '#f87171', fontWeight: '700' },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 14,
  },
  priceLabel: { fontSize: 11, color: '#cbd5e1', marginBottom: 3, fontWeight: '600' },
  price: { fontSize: 18, fontWeight: '900', color: '#dc2626' },
  payButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payText: {
    color: '#0a0f1e',
    fontWeight: '800',
    fontSize: 14,
  },
});
