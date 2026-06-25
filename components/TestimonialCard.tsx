import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TestimonialCardProps {
  item: {
    name: string;
    rating: number;
    comment: string;
    date?: string;
  };
}

export default function TestimonialCard({ item }: TestimonialCardProps) {
  const { width: SCREEN_W } = useWindowDimensions();
  const cardWidth = Math.min(280, SCREEN_W * 0.75);
  const isSmall = SCREEN_W < 375;

  const initials = item.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#d97706'];
  const color = colors[item.name.charCodeAt(0) % colors.length];

  return (
    <View style={[styles.card, { width: cardWidth }, isSmall && { padding: 12 }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: color }, isSmall && { width: 36, height: 36 }]}>
          <Text style={[styles.avatarText, isSmall && { fontSize: 12 }]}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, isSmall && { fontSize: 13 }]}>{item.name}</Text>
          <View style={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={isSmall ? 12 : 14} color={i < item.rating ? '#f59e0b' : '#d1d5db'} style={{ marginRight: 2 }} />
            ))}
            {item.date && <Text style={[styles.date, isSmall && { fontSize: 10 }]}> • {item.date}</Text>}
          </View>
        </View>
      </View>
      <Text style={[styles.comment, isSmall && { fontSize: 12 }]}>"{item.comment}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  name: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111827',
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: '#9ca3af',
  },
  comment: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
