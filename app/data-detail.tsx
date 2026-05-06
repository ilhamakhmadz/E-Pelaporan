import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

import { LeafletMap } from '@/components/LeafletMap';

const { width } = Dimensions.get('window');

export default function DataDetailScreen() {
  const { data, type } = useLocalSearchParams<{ data: string, type: 'peti' | 'iup' }>();
  const router = useRouter();
  const parsedData = data ? JSON.parse(decodeURIComponent(data)) : { detail: {} };
  const item = parsedData;
  const detail = item.detail || parsedData;

  const parseCoords = (coordStr: string) => {
    if (!coordStr) return null;
    const parts = coordStr.split(',').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { latitude: parts[0], longitude: parts[1] };
    }
    return null;
  };

  const coords = parseCoords(detail.lokasi_koordinat || detail.titik_kordinat_tambang || detail.titik_kordinat);

  const renderInfoItem = (label: string, value: any, icon: string) => (
    <View style={styles.infoBox}>
      <View style={styles.infoIconBox}>
        <MaterialCommunityIcons name={icon as any} size={20} color={Colors.light.primary} />
      </View>
      <View style={styles.infoTextContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '-'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Detail Informasi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner / Map Section */}
        <View style={styles.mapContainer}>
          {coords && Platform.OS !== 'web' ? (
            <LeafletMap
              style={styles.map}
              initialRegion={{
                ...coords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              markers={[{
                id: 'detail-marker',
                coordinate: coords,
                color: type === 'peti' ? '#e63946' : '#006767'
              }]}
            />
          ) : (
            <View style={[styles.map, styles.mapPlaceholder]}>
              <MaterialCommunityIcons name="map-marker-radius" size={48} color={Colors.light.outline} />
              <Text style={styles.placeholderText}>
                {coords ? 'Peta tersedia di perangkat mobile' : 'Koordinat tidak tersedia'}
              </Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.mapOverlay}
          >
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{type === 'peti' ? 'LAPORAN PETI' : detail.jenis_perizinan || 'IUP ACTIVE'}</Text>
            </View>
            <Text style={styles.mainTitle}>
              {type === 'peti' ? detail.terlapor_atau_nama_perusahaan : detail.nama_pemegang_iup__atau_sipb}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information-outline" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Data Wilayah & Lokasi</Text>
          </View>
          
          <View style={styles.card}>
            {renderInfoItem('Kecamatan', detail.kecamatan, 'map-marker')}
            {renderInfoItem('Desa', detail.desa, 'home-city')}
            {type === 'iup' && renderInfoItem('Lokasi Tambang', detail.lokasi_tambang, 'office-building-marker')}
            {renderInfoItem('Koordinat', detail.lokasi_koordinat || detail.titik_kordinat_tambang, 'crosshairs-gps')}
          </View>

          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Informasi Teknis</Text>
          </View>

          <View style={styles.card}>
            {type === 'peti' ? (
              <>
                {renderInfoItem('Pelapor', detail.pelapor, 'account-tie')}
                {renderInfoItem('Komoditas', detail.komoditas, 'cube-outline')}
                {renderInfoItem('Penanganan', detail.penanganan_atau_tindak_lanjut, 'hammer-wrench')}
                {renderInfoItem('Tahun', detail.tahun_penanganan, 'calendar-range')}
                {renderInfoItem('Keterangan', detail.keterangan, 'text-box-outline')}
              </>
            ) : (
              <>
                {renderInfoItem('Nomor SK', detail.nomor_sk_iup_atau_sipb, 'file-certificate')}
                {renderInfoItem('Jenis Komoditas', detail.jenis_komoditas, 'layers-triple')}
                {renderInfoItem('Komoditas Spesifik', detail.komoditas, 'cube-outline')}
                {renderInfoItem('Luas Wilayah', `${detail.luas_wilayah_ha} Ha`, 'ruler-square')}
                {renderInfoItem('Tanggal Terbit', detail.tanggal_terbit_izin, 'calendar-check')}
                {renderInfoItem('Tanggal Habis', detail.tanggal_habis_izin, 'calendar-remove')}
                {renderInfoItem('Status Operasi', detail.status_operasi_produksi, 'list-status')}
              </>
            )}
          </View>

          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <MaterialCommunityIcons name="camera-outline" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Dokumentasi Lapangan</Text>
          </View>

          <View style={styles.photoContainer}>
            <View style={styles.photoBox}>
              {detail.foto1 ? (
                <Image source={{ uri: detail.foto1 }} style={styles.photoImage} />
              ) : (
                <View style={styles.noPhoto}>
                  <MaterialCommunityIcons name="image-off-outline" size={32} color={Colors.light.outline} />
                  <Text style={styles.noPhotoText}>Foto 1 tidak tersedia</Text>
                </View>
              )}
            </View>
            <View style={styles.photoBox}>
              {detail.foto2 ? (
                <Image source={{ uri: detail.foto2 }} style={styles.photoImage} />
              ) : (
                <View style={styles.noPhoto}>
                  <MaterialCommunityIcons name="image-off-outline" size={32} color={Colors.light.outline} />
                  <Text style={styles.noPhotoText}>Foto 2 tidak tersedia</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>ID Data: {item.id}</Text>
            <Text style={styles.footerText}>Dibuat: {item.created_at}</Text>
            <Text style={styles.footerText}>Terakhir Diupdate: {item.updated_at}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Re-using LinearGradient for consistency
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,103,103,0.05)',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#e9ecef',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: {
    fontFamily: Fonts.medium,
    color: Colors.light.outline,
    fontSize: 14,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 60,
  },
  statusBadge: {
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontFamily: Fonts.extraBold,
    fontSize: 10,
    color: 'white',
    letterSpacing: 1,
  },
  mainTitle: {
    fontFamily: Fonts.extraBold,
    fontSize: 24,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  detailsSection: {
    padding: 20,
    marginTop: -24,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.light.text,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,103,103,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.light.outline,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.light.text,
  },
  footer: {
    marginTop: 32,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  photoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  photoBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
    shadowOpacity: 0.02,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f3f5',
    gap: 8,
  },
  noPhotoText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: Colors.light.outline,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.light.outline,
    textAlign: 'center',
  },
});
