import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman ini sedang dalam pengembangan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.light.outline,
  },
});
