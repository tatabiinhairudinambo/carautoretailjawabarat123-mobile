import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform, useWindowDimensions, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function TabIcon({ focused, icon, label }: { focused: boolean; icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.iconSlot}>
        <Ionicons name={icon} size={24} color={focused ? '#ffffff' : '#cbd5e1'} style={focused && styles.emojiActive} />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function HomeTabIcon({ focused }: { focused: boolean }) {
  const { width: SCREEN_W } = useWindowDimensions();
  const isSmall = SCREEN_W < 375;
  const circleSize = isSmall ? 52 : 58;
  return (
    <View style={styles.tabContainer}>
      <View style={styles.iconSlot}>
        <View style={[styles.homeInner, focused && styles.homeInnerActive, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, bottom: -4 }]}>
          <Ionicons name={focused ? 'home' : 'home-outline'} size={isSmall ? 26 : 28} color="#fff" />
        </View>
      </View>
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>Beranda</Text>
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
        tabBarBackground: () => (
          <ImageBackground source={require('../../assets/logo.jpg')} style={StyleSheet.absoluteFill}>
            <View style={styles.tabBarOverlay} />
          </ImageBackground>
        ),
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
            <TabIcon focused={focused} icon="location-outline" label="Lokasi" />
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
    backgroundColor: '#881337',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(110, 15, 42, 0.92)',
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: 50,
  },
  iconSlot: {
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emojiActive: {
    transform: [{ scale: 1.15 }],
  },
  label: {
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#cbd5e1',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  labelActive: {
    color: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Home center button circle
  homeInner: {
    position: 'absolute',
    backgroundColor: '#dc2626',
    borderWidth: 3.5,
    borderColor: '#881337',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  homeInnerActive: {
    backgroundColor: '#b91c1c',
  },
});

