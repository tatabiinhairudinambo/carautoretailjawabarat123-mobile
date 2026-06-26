import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

// Apply global Arial font
const font = Platform.select({ web: 'Arial, sans-serif', ios: 'Arial', android: 'sans-serif' });
if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
(Text as any).defaultProps.style = { fontFamily: font };

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(() => setReady(true));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0f1e' }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/register" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="verify" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="rating" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="car-detail" options={{ animation: 'slide_from_right' }} />
      </Stack>

      {!ready && (
        <View style={[StyleSheet.absoluteFillObject, splash.container]}>
          <View style={splash.iconWrap}>
            <Ionicons name="car-sport" size={48} color="#dc2626" />
          </View>
          <Text style={splash.title}>CarAutoRetail</Text>
          <Text style={splash.sub}>Jawa Barat</Text>
          <ActivityIndicator size="small" color="#dc2626" style={{ marginTop: 32 }} />
        </View>
      )}
    </View>
  );
}

const splash = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e', alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 88, height: 88, borderRadius: 24,
    backgroundColor: 'rgba(220,38,38,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(220,38,38,0.25)', marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '900', color: '#f1f5f9', letterSpacing: 1 },
  sub: { fontSize: 14, color: '#cbd5e1', marginTop: 4, fontWeight: '600', letterSpacing: 2 },
});
