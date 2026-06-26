import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function TabIcon({ focused, icon, label }: { focused: boolean; icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.tabContainer}>
      <Ionicons name={icon} size={22} color={focused ? '#ef4444' : 'rgba(255,255,255,0.5)'} style={focused && styles.emojiActive} />
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
    </View>
  );
}

function HomeTabIcon({ focused }: { focused: boolean }) {
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  return (
    <View style={styles.homeButton}>
      <View style={[styles.homeInner, focused && styles.homeInnerActive, { width: isSmall ? 56 : 64, height: isSmall ? 56 : 64, borderRadius: isSmall ? 28 : 32 }]}>
        <Ionicons name={focused ? 'home' : 'home-outline'} size={isSmall ? 26 : 30} color="#fff" />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1} adjustsFontSizeToFit>Beranda</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="cars"
        options={{
          tabBarItemStyle: { flex: 1 },
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="car-outline" label="Armada" />
          ),
        }}
      />
      <Tabs.Screen
        name="prices"
        options={{
          tabBarItemStyle: { flex: 1 },
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="pricetag-outline" label="Harga" />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarItemStyle: { flex: 1 },
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wilayah"
        options={{
          tabBarItemStyle: { flex: 1 },
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="location-outline" label="Wilayah" />
          ),
        }}
      />
      <Tabs.Screen
        name="akun"
        options={{
          tabBarItemStyle: { flex: 1 },
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="person-outline" label="Akun" />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{ href: null, tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="faq"
        options={{ href: null, tabBarItemStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="tentang"
        options={{ href: null, tabBarItemStyle: { display: 'none' } }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0a0f1e',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingHorizontal: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
    gap: 4,
  },
  emojiActive: {
    transform: [{ scale: 1.15 }],
  },
  label: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  labelActive: {
    color: '#ef4444',
    fontWeight: '800',
  },

  // Home center button
  homeButton: {
    alignItems: 'center',
    marginTop: -22,
    justifyContent: 'center',
    gap: 4,
  },
  homeInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dc2626',
    borderWidth: 4,
    borderColor: '#0a0f1e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  homeInnerActive: {
    backgroundColor: '#b91c1c',
    shadowOpacity: 0.8,
  },
});

