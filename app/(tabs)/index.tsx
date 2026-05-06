import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [counts, setCounts] = useState({ iup: 0, peti: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      const [iupRes, petiRes] = await Promise.all([
        fetch('https://api.bandungkab.go.id/api/data/data-izin-usaha-pertambangan-dan-surat-izin-penambangan-batuan-kabupaten-bandung'),
        fetch('https://api.bandungkab.go.id/api/data/data-pertambangan-tanpa-izin-di-kabupaten-bandung')
      ]);
      
      const iupData = await iupRes.json();
      const petiData = await petiRes.json();
      
      setCounts({
        iup: iupData.total || 0,
        peti: petiData.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
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
            <Text style={styles.greeting}>Halo, Petugas</Text>
            <Text style={styles.subGreeting}>Pemeriksaan Wilayah Bandung</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Hero */}
        <View style={styles.hero}>
          <Text style={styles.welcomeTitle}>Selamat Datang</Text>
          <Text style={styles.welcomeSubtitle}>
            Pantau aktivitas pertambangan dan kelola perizinan secara transparan untuk masa depan lingkungan yang lebih baik.
          </Text>
        </View>

        {/* Menu Cards */}
        <View style={styles.cardContainer}>
          {/* Card 1: IUP & SIPB */}
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push({
              pathname: '/data-list',
              params: { type: 'iup', title: 'Data IUP & SIPB' }
            })}
          >
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <MaterialCommunityIcons name="clipboard-check-outline" size={32} color="white" />
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>TOTAL IZIN</Text>
                  {loading ? (
                    <ActivityIndicator size="small" color="white" style={{ marginTop: 8 }} />
                  ) : (
                    <Text style={styles.statValue}>{counts.iup}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.cardTitle}>IUP & SIPB</Text>
              <Text style={styles.cardDesc}>
                Pengelolaan Izin Usaha Pertambangan dan Surat Izin Penambangan Batuan wilayah Bandung.
              </Text>
              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>LIHAT SEMUA IZIN</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card 2: PETI */}
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push({
              pathname: '/data-list',
              params: { type: 'peti', title: 'Data PETI' }
            })}
          >
            <LinearGradient
              colors={['#ff6b6b', Colors.light.error]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <MaterialCommunityIcons name="alert-circle" size={32} color="white" />
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>WASPADA</Text>
                  {loading ? (
                    <ActivityIndicator size="small" color="white" style={{ marginTop: 8 }} />
                  ) : (
                    <Text style={styles.statValue}>{counts.peti}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.cardTitle}>Pertambangan Tanpa Izin</Text>
              <Text style={styles.cardDesc}>Laporan aktivitas penambangan ilegal dan pemantauan titik panas lapangan.</Text>
              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>LIHAT DATA PETI</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktivitas Terkini</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>LIHAT SEMUA</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIconBox, { backgroundColor: 'rgba(117, 251, 187, 0.2)' }]}>
                <MaterialCommunityIcons name="file-document" size={24} color={Colors.light.secondary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Laporan Verifikasi PT. Maju Jaya</Text>
                <Text style={styles.activityTime}>2 jam yang lalu • Inspeksi Lapangan</Text>
              </View>
              <View style={styles.badgeSelesai}>
                <Text style={styles.badgeText}>SELESAI</Text>
              </View>
            </View>

            <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.activityIconBox, { backgroundColor: 'rgba(15, 130, 130, 0.1)' }]}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color={Colors.light.primary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Deteksi Titik PETI Baru</Text>
                <Text style={styles.activityTime}>5 jam yang lalu • Koordinat: -7.021, 107.514</Text>
              </View>
              <View style={styles.badgeKritis}>
                <Text style={styles.badgeText}>KRITIS</Text>
              </View>
            </View>
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
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(249, 249, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.light.primary,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(62, 73, 73, 0.7)',
    marginTop: -2,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  hero: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontFamily: Fonts.extraBold,
    fontSize: 36,
    color: Colors.light.text,
    letterSpacing: -1,
  },
  welcomeSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.light.onSurfaceVariant,
    lineHeight: 24,
    marginTop: 8,
  },
  cardContainer: {
    gap: 20,
  },
  menuCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardIconBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 16,
  },
  statBox: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  statValue: {
    fontFamily: Fonts.extraBold,
    fontSize: 28,
    color: 'white',
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 20,
  },
  cardButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cardButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: 'white',
    textTransform: 'uppercase',
  },
  activitySection: {
    marginTop: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.text,
  },
  seeAllText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.light.primary,
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  activityIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 16,
  },
  activityTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.light.text,
  },
  activityTime: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.light.onSurfaceVariant,
    marginTop: 2,
  },
  badgeSelesai: {
    backgroundColor: 'rgba(117, 251, 187, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeKritis: {
    backgroundColor: 'rgba(255, 218, 214, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: Fonts.extraBold,
    fontSize: 10,
    color: Colors.light.text,
  },
});
