import { Platform } from 'react-native';

const tintColorLight = '#006767';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#111c2d',
    background: '#f9f9ff',
    tint: tintColorLight,
    icon: '#6e7979',
    tabIconDefault: '#6e7979',
    tabIconSelected: tintColorLight,
    primary: '#006767',
    secondary: '#006c47',
    surface: '#ffffff',
    error: '#ba1a1a',
    outline: '#6e7979',
    surfaceVariant: '#d8e3fb',
    onSurfaceVariant: '#3e4949',
    primaryContainer: '#0f8282',
    secondaryContainer: '#75fbbb',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#78d6d5',
    secondary: '#55dea1',
    surface: '#1A1C1E',
    error: '#ffb4ab',
    outline: '#8e918f',
    surfaceVariant: '#444746',
    onSurfaceVariant: '#c4c7c5',
    primaryContainer: '#005050',
    secondaryContainer: '#005235',
  },
};

export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_600Medium',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};
