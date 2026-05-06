import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

let NativeMapView: any = null;
let NativeMarker: any = null;
let NativeCallout: any = null;

try {
  // Only try to require if we are on native and the module exists
  const Maps = require('react-native-maps');
  NativeMapView = Maps.default || Maps;
  NativeMarker = Maps.Marker || Maps.default?.Marker;
  NativeCallout = Maps.Callout || Maps.default?.Callout;
} catch (e) {
  console.log('react-native-maps native module not found, using fallback.');
}

const FallbackMap = ({ style, children }: any) => (
  <View style={[styles.placeholder, style]}>
    <MaterialCommunityIcons name="map-outline" size={48} color={Colors.light.outline} />
    <Text style={styles.placeholderText}>
      Peta interaktif tidak didukung di perangkat ini.
    </Text>
  </View>
);

export const MapView = NativeMapView || FallbackMap;
export const Marker = NativeMarker || (({ children }: any) => <>{children}</>);
export const Callout = NativeCallout || (({ children }: any) => <>{children}</>);

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    gap: 12,
  },
  placeholderText: {
    fontFamily: Fonts.medium,
    textAlign: 'center',
    color: Colors.light.outline,
    fontSize: 14,
  },
});
