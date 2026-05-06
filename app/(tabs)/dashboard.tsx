import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    iupTotal: 0,
    petiTotal: 0,
    topKecamatan: [] as { name: string, count: number }[],
    topCommodities: [] as { name: string, count: number }[],
  });

  const fetchData = async () => {
    try {
      const [iupRes, petiRes] = await Promise.all([
        fetch('https://api.bandungkab.go.id/api/data/data-izin-usaha-pertambangan-dan-surat-izin-penambangan-batuan-kabupaten-bandung'),
        fetch('https://api.bandungkab.go.id/api/data/data-pertambangan-tanpa-izin-di-kabupaten-bandung')
      ]);
      
      const iupJson = await iupRes.json();
      const petiJson = await petiRes.json();
      
      const iupData = iupJson.data || [];
      const petiData = petiJson.data || [];

      // Calculate stats
      const kecCount: any = {};
      petiData.forEach((item: any) => {
        const kec = item.detail.kecamatan;
        if (kec) kecCount[kec] = (kecCount[kec] || 0) + 1;
      });

      const topKec = Object.keys(kecCount)
        .map(key => ({ name: key, count: kecCount[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const commCount: any = {};
      iupData.forEach((item: any) => {
        const comm = item.detail.jenis_komoditas || item.detail.komoditas;
        if (comm) commCount[comm] = (commCount[comm] || 0) + 1;
      });

      const topComm = Object.keys(commCount)
        .map(key => ({ name: key, count: commCount[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setStats({
        iupTotal: iupJson.total || 0,
        petiTotal: petiJson.total || 0,
        topKecamatan: topKec,
        topCommodities: topComm,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 12 }]}>
        <View style={styles.userInfo}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkS2KlatuIjtO9rfQ84Xah9tMQuhaG5v3ILV12NSaTIBqZ0CaqtfmJXBormip088hY4PO8bbGG-vYZ_gZtzXSbQFO_um4nZGjSQbNXKjY_gbBLKY6LINGXjNFQGABwB4J5OTrI7Zdj-NctmE2gl18GhcgH8Y-AD44f36VSEWfGjMH3n4uMm51i2BAIEVfWn1OSr3X0ReNU6LmUOr5f0Zfhbc2fPvmcpkLMPFAJOANRVXZLL8zzF43STPN3g6uATpJ7bJyfNnkhh7o' }}
              style={styles.profileImage}
            />
          </View>
          <View>
            <Text style={styles.greeting}>Statistik & Monitoring</Text>
            <Text style={styles.subGreeting}>Data Real-time Kabupaten Bandung</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={() => fetchData()}>
          <MaterialCommunityIcons name="refresh" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Stats Row */}
        <View style={styles.statCardsRow}>
          <TouchableOpacity 
            style={styles.mainStatCard}
            onPress={() => router.push({ pathname: '/data-list', params: { type: 'iup', title: 'Data IUP & SIPB' } })}
          >
            <LinearGradient colors={[Colors.light.primary, '#008c8c']} style={styles.statGradient}>
              <MaterialCommunityIcons name="file-check" size={28} color="white" />
              <Text style={styles.statNumber}>{loading ? '...' : stats.iupTotal}</Text>
              <Text style={styles.statLabel}>IUP & SIPB</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mainStatCard}
            onPress={() => router.push({ pathname: '/data-list', params: { type: 'peti', title: 'Data PETI' } })}
          >
            <LinearGradient colors={['#ff6b6b', '#e63946']} style={styles.statGradient}>
              <MaterialCommunityIcons name="alert-decagram" size={28} color="white" />
              <Text style={styles.statNumber}>{loading ? '...' : stats.petiTotal}</Text>
              <Text style={styles.statLabel}>Total PETI</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Detailed Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Wilayah PETI</Text>
          <View style={styles.insightCard}>
            {loading ? (
              <ActivityIndicator color={Colors.light.primary} />
            ) : (
              stats.topKecamatan.map((kec, index) => (
                <View key={kec.name} style={styles.insightRow}>
                  <View style={styles.insightInfo}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                    <Text style={styles.kecName}>{kec.name}</Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{kec.count} Titik</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Komoditas Terbanyak (IUP)</Text>
          <View style={styles.insightCard}>
            {loading ? (
              <ActivityIndicator color={Colors.light.primary} />
            ) : (
              stats.topCommodities.map((comm, index) => (
                <View key={comm.name} style={styles.insightRow}>
                  <View style={styles.insightInfo}>
                    <View style={[styles.colorDot, { backgroundColor: index === 0 ? '#006767' : index === 1 ? '#008c8c' : '#208a8a' }]} />
                    <Text style={styles.commName}>{comm.name}</Text>
                  </View>
                  <Text style={styles.commCount}>{comm.count} Izin</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontFamily: Fonts.extraBold,
    fontSize: 22,
    color: Colors.light.primary,
  },
  subGreeting: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.light.outline,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 103, 103, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  statCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mainStatCard: {
    width: (width - 60) / 2,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontFamily: Fonts.extraBold,
    fontSize: 32,
    color: 'white',
  },
  statLabel: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  insightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankText: {
    fontFamily: Fonts.extraBold,
    fontSize: 14,
    color: Colors.light.primary,
  },
  kecName: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.light.text,
  },
  countBadge: {
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#e63946',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  commName: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.light.text,
  },
  commCount: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.light.outline,
  },
});
