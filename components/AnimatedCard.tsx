import React, { useEffect, useRef } from 'react';
import { Animated, TouchableWithoutFeedback, ViewStyle, StyleProp } from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeScale?: number;
}

export default function AnimatedCard({
  children,
  delay = 0,
  style,
  onPress,
  activeScale = 0.96,
}: AnimatedCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 45,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: activeScale,
        useNativeDriver: true,
        speed: 35,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 25,
      }).start();
    }
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY }, { scale: scaleAnim }],
  };

  if (onPress) {
    return (
      <TouchableWithoutFeedback onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
