import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Image,
  Easing,
  useWindowDimensions,
} from 'react-native';

const MIN_DISPLAY_MS = 5000;

interface PageLoaderProps {
  text?: string;
  ready?: boolean;
  onDone?: () => void;
}

export default function PageLoader({ text = 'Memuat...', ready = false, onDone }: PageLoaderProps) {
  const { width: W, height: H } = useWindowDimensions();

  const isSmall  = W < 375;
  const logoSize = isSmall ? 96 : W > 500 ? 140 : 120;
  const fontSize = isSmall ? 19 : W > 500 ? 26  : 22;
  const dotSize  = isSmall ? 7  : 9;
  const barWidth = Math.min(W * 0.58, 260);

  const logoScale   = useRef(new Animated.Value(0.72)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const dot1        = useRef(new Animated.Value(0)).current;
  const dot2        = useRef(new Animated.Value(0)).current;
  const dot3        = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim= useRef(new Animated.Value(0)).current;

  const startTime = useRef(Date.now());
  const readyRef  = useRef(ready);
  useEffect(() => { readyRef.current = ready; }, [ready]);

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale,   { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 600, delay: 350, useNativeDriver: true }),
    ]).start();

    // Bouncing dots
    const makeDot = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: -10, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(val, { toValue: 0,   duration: 320, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
          Animated.delay(640 - delay),
        ])
      );
    const d1 = makeDot(dot1, 0);
    const d2 = makeDot(dot2, 200);
    const d3 = makeDot(dot3, 400);
    d1.start(); d2.start(); d3.start();

    // Progress bar 5 detik
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: MIN_DISPLAY_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // onDone callback
    if (onDone) {
      const elapsed   = Date.now() - startTime.current;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      const timer = setTimeout(() => {
        if (readyRef.current) { onDone(); return; }
        const poll = setInterval(() => {
          if (readyRef.current) { clearInterval(poll); onDone(); }
        }, 100);
      }, remaining);
      return () => {
        clearTimeout(timer);
        d1.stop(); d2.stop(); d3.stop();
      };
    }

    return () => { d1.stop(); d2.stop(); d3.stop(); };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth],
  });

  return (
    <View style={[styles.container, { width: W, height: H }]}>
      <View style={styles.centerBlock}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoCard,
            {
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize * 0.25,
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image
            source={require('../assets/logo.jpg')}
            style={styles.logoImg}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Brand name */}
        <Animated.View style={[styles.brandWrap, { opacity: textOpacity }]}>
          <Text style={[styles.brandName, { fontSize }]}>Car Auto Garage</Text>
        </Animated.View>

        {/* Progress bar */}
        <View style={[styles.progressTrack, { width: barWidth }]}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        {/* Bouncing dots */}
        <Animated.View style={[styles.dotsRow, { opacity: textOpacity }]}>
          <Animated.View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: '#dc2626', transform: [{ translateY: dot1 }] }} />
          <Animated.View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: '#fbbf24', transform: [{ translateY: dot2 }] }} />
          <Animated.View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: '#dc2626', transform: [{ translateY: dot3 }] }} />
        </Animated.View>

        {/* Loading text */}
        <Animated.Text style={[styles.loadingText, { fontSize: isSmall ? 11 : 13, opacity: textOpacity }]}>
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#0a0f1e',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(220,38,38,0.55)',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 16,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  brandWrap: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  brandName: {
    fontWeight: '900',
    color: '#f1f5f9',
    letterSpacing: 0.5,
    fontFamily: 'Arial',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
    marginBottom: 22,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#dc2626',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 14,
  },
  loadingText: {
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
