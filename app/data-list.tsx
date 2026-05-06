import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';

interface DataItem {
  id: number;
  detail: any;
}

export default function DataListScreen() {
  const { type, title } = useLocalSearchParams<{ type: 'peti' | 'iup', title: string }>();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const API_URLS = {
    peti: 'https://api.bandungkab.go.id/api/data/data-pertambangan-tanpa-izin-di-kabupaten-bandung',
    iup: 'https://api.bandungkab.go.id/api/data/data-izin-usaha-pertambangan-dan-surat-izin-penambangan-batuan-kabupaten-bandung',
  };

  const fetchData = async () => {
    try {
      const response = await fetch(API_URLS[type]);
      const json = await response.json();
      if (json.status === 'success') {
        setData(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredData = data.filter((item) => {
    const detail = item.detail;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (type === 'peti') {
      return (
        detail.terlapor_atau_nama_perusahaan?.toLowerCase().includes(query) ||
        detail.kecamatan?.toLowerCase().includes(query) ||
        detail.desa?.toLowerCase().includes(query)
      );
    }
    return (
      detail.nama_pemegang_iup__atau_sipb?.toLowerCase().includes(query) ||
      detail.kecamatan?.toLowerCase().includes(query) ||
      detail.desa?.toLowerCase().includes(query)
    );
  });

  const renderItem = ({ item }: { item: DataItem }) => {
    const detail = item.detail;

    if (type === 'peti') {
      return (
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push({
            pathname: '/data-detail',
            params: { data: encodeURIComponent(JSON.stringify(item)), type }
          })}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.companyName}>{detail.terlapor_atau_nama_perusahaan}</Text>
            <View style={styles.badgeError}>
              <Text style={styles.badgeText}>PETI</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.light.outline} />
            <Text style={styles.infoText}>{detail.kecamatan}, {detail.desa}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="cube-outline" size={16} color={Colors.light.outline} />
            <Text style={styles.infoText}>Komoditas: {detail.komoditas}</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {detail.keterangan || 'Tidak ada keterangan'}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({
          pathname: '/data-detail',
          params: { data: encodeURIComponent(JSON.stringify(item)), type }
        })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.companyName}>{detail.nama_pemegang_iup__atau_sipb}</Text>
          <View style={styles.badgeSuccess}>
            <Text style={styles.badgeText}>{detail.jenis_perizinan}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.light.outline} />
          <Text style={styles.infoText}>{detail.kecamatan}, {detail.desa}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-clock-outline" size={16} color={Colors.light.outline} />
          <Text style={styles.infoText}>Berlaku hingga: {detail.tanggal_habis_izin}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="layers-outline" size={16} color={Colors.light.outline} />
          <Text style={styles.infoText}>Luas: {detail.luas_wilayah_ha} Ha</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'Data List'}</Text>
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/add-form',
            params: { type, title: `Tambah ${title}` }
          })}
          style={styles.addButton}
        >
          <MaterialCommunityIcons name="plus" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={Colors.light.outline} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama atau lokasi..."
          placeholderTextColor={Colors.light.outline}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.light.outline} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Tidak ada data ditemukan.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.primary,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.light.onSurfaceVariant,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.light.outline,
    marginTop: 8,
    fontStyle: 'italic',
  },
  badgeError: {
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(0, 103, 103, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: Colors.light.primary,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Fonts.regular,
    color: Colors.light.outline,
  },
  emptyText: {
    fontFamily: Fonts.medium,
    color: Colors.light.outline,
  },
});
