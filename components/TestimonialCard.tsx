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
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b'];
  const color = colors[item.name.charCodeAt(0) % colors.length];

  return (
    <View style={[styles.card, { width: cardWidth }, isSmall && { padding: 14 }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: color }, isSmall && { width: 36, height: 36 }]}>
          <Text style={[styles.avatarText, isSmall && { fontSize: 12 }]}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, isSmall && { fontSize: 13 }]}>{item.name}</Text>
          <View style={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={isSmall ? 12 : 14} color={i < item.rating ? '#f59e0b' : '#475569'} style={{ marginRight: 2 }} />
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
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 18,
    marginRight: 14,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  name: {
    fontWeight: '800',
    fontSize: 14,
    color: '#f8fafc',
    letterSpacing: 0.2,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  date: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  comment: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 21,
    fontStyle: 'italic',
    fontWeight: '400',
  },
});

