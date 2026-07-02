import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import PageLoader from '../components/PageLoader';

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
        <Stack.Screen name="auth/Silahkan Masuk" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/register" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="verify" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="rating" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="car-detail" options={{ animation: 'slide_from_right' }} />
      </Stack>

      {!ready && (
        <View style={StyleSheet.absoluteFillObject}>
          <PageLoader text="Menyiapkan aplikasi..." />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
