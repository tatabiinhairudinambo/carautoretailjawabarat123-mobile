import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const scaleW = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

export const scaleH = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

export const scaleFont = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * Math.min(scale, 1.2);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const isSmall = SCREEN_WIDTH < 375;
export const isMedium = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
export const isLarge = SCREEN_WIDTH >= 768;

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
