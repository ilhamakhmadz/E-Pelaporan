import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

export const MapView = ({ children, style }: any) => (
  <View style={[styles.placeholder, style]}>
    <MaterialCommunityIcons name="map-outline" size={64} color={Colors.light.outline} />
    <Text style={styles.placeholderText}>
      Peta interaktif tersedia di perangkat mobile (Android/iOS).
    </Text>
  </View>
);

export const Marker = ({ children }: any) => <>{children}</>;
export const Callout = ({ children }: any) => <>{children}</>;

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    gap: 16,
  },
  placeholderText: {
    fontFamily: Fonts.medium,
    textAlign: 'center',
    color: Colors.light.outline,
    lineHeight: 22,
  },
});
