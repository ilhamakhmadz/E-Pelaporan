import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Fonts } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { LeafletMap } from '@/components/LeafletMap';

interface MapItem {
  id: number;
  type: 'peti' | 'iup';
  title: string;
  coords: { latitude: number, longitude: number };
  detail: any;
}

export default function MapScreen() {
  const [data, setData] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const parseCoords = (coordStr: string) => {
    if (!coordStr) return null;
    const parts = coordStr.split(',').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { latitude: parts[0], longitude: parts[1] };
    }
    return null;
  };

  const fetchData = async () => {
    try {
      const [iupRes, petiRes] = await Promise.all([
        fetch('https://api.bandungkab.go.id/api/data/data-izin-usaha-pertambangan-dan-surat-izin-penambangan-batuan-kabupaten-bandung'),
        fetch('https://api.bandungkab.go.id/api/data/data-pertambangan-tanpa-izin-di-kabupaten-bandung')
      ]);

      const iupJson = await iupRes.json();
      const petiJson = await petiRes.json();

      const combined: MapItem[] = [];

      if (iupJson.status === 'success') {
        iupJson.data.forEach((item: any) => {
          const coords = parseCoords(item.detail.titik_kordinat_tambang || item.detail.titik_kordinat);
          if (coords) {
            combined.push({
              id: item.id,
              type: 'iup',
              title: item.detail.nama_pemegang_iup__atau_sipb,
              coords,
              detail: item,
            });
          }
        });
      }

      if (petiJson.status === 'success') {
        petiJson.data.forEach((item: any) => {
          const coords = parseCoords(item.detail.lokasi_koordinat || item.detail.titik_kordinat);
          if (coords) {
            combined.push({
              id: item.id,
              type: 'peti',
              title: item.detail.terlapor_atau_nama_perusahaan,
              coords,
              detail: item,
            });
          }
        });
      }

      setData(combined);
    } catch (error) {
      console.error('Failed to fetch map data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Peta Sebaran Pertambangan</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => { setLoading(true); fetchData(); }}>
          <MaterialCommunityIcons name="refresh" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrapper}>
        <LeafletMap
          style={styles.map}
          initialRegion={{
            latitude: -7.025253,
            longitude: 107.519760,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          markers={data.map((item) => ({
            id: `${item.type}-${item.id}`,
            coordinate: item.coords,
            title: item.title,
            subtitle: item.type === 'peti' ? 'LAPORAN PETI (Klik untuk detail)' : 'IUP & SIPB (Klik untuk detail)',
            color: item.type === 'peti' ? '#e63946' : '#006767',
          }))}
          onMarkerPress={(id) => {
            const item = data.find(d => `${d.type}-${d.id}` === id);
            if (item) {
              router.push({
                pathname: '/data-detail',
                params: { data: encodeURIComponent(JSON.stringify(item.detail)), type: item.type }
              });
            }
          }}
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Memuat peta...</Text>
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#006767' }]} />
            <Text style={styles.legendText}>IUP & SIPB</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#e63946' }]} />
            <Text style={styles.legendText}>PETI</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontFamily: Fonts.extraBold,
    fontSize: 18,
    color: Colors.light.primary,
  },
  refreshBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,103,103,0.05)',
    borderRadius: 12,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
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
  fetchBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    marginTop: 20,
  },
  fetchBtnText: {
    color: 'white',
    fontFamily: Fonts.bold,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Fonts.bold,
    color: Colors.light.primary,
  },
  legend: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.light.text,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  calloutType: {
    fontFamily: Fonts.extraBold,
    fontSize: 10,
    color: Colors.light.outline,
    marginBottom: 6,
  },
  calloutAction: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: Colors.light.primary,
    textAlign: 'right',
  },
});
