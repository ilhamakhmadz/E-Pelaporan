import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: 'rgba(62, 73, 73, 0.6)',
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 24 }]} />
        ),
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <MaterialCommunityIcons name={focused ? "view-dashboard" : "view-dashboard-outline"} size={24} color={focused ? 'white' : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="peta"
        options={{
          title: 'Peta',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "map-marker-radius" : "map-marker-radius-outline"} size={24} color={color} />
          ),
        }}
      />
      {/* Hidden tabs */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 74,
    borderRadius: 24,
    backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    paddingTop: 12,
  },
  tabBarLabel: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
