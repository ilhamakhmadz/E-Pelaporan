import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { LeafletMap } from '@/components/LeafletMap';

export default function AddFormScreen() {
  const { type, title } = useLocalSearchParams<{ type: 'peti' | 'iup', title: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Region Data
  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);
  const [filteredDesa, setFilteredDesa] = useState<string[]>([]);
  
  // Picker State
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState<'kecamatan' | 'desa'>('kecamatan');
  
  // Map State
  const [mapVisible, setMapVisible] = useState(false);
  const [tempLocation, setTempLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  // Date State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<string>('');

  // Form State
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<any>({
    kecamatan: '',
    desa: '',
    tanggal_terbit_izin: today,
    tanggal_habis_izin: today,
    tahun_penanganan: new Date().getFullYear().toString(),
  });

  const [images, setImages] = useState<{ [key: string]: string | null }>({
    foto1: null,
    foto2: null,
  });

  useEffect(() => {
    fetchRegions();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    })();
  }, []);

  const fetchRegions = async () => {
    try {
      const [kecRes, desaRes] = await Promise.all([
        fetch('https://api.bandungkab.go.id/api/data/kecamatan'),
        fetch('https://api.bandungkab.go.id/api/data/desa')
      ]);
      const kecJson = await kecRes.json();
      const desaJson = await desaRes.json();

      if (kecJson.status === 'success') {
        const uniqueKec = Array.from(new Set(kecJson.data.map((item: any) => item.detail.kecamatan))).sort();
        setKecamatanList(uniqueKec as string[]);
      }
      if (desaJson.status === 'success') {
        setDesaList(desaJson.data);
      }
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    }
  };

  const handleKecamatanSelect = (kec: string) => {
    updateField('kecamatan', kec);
    updateField('desa', ''); // Reset desa
    const filtered = desaList
      .filter((item: any) => item.detail.kecamatan === kec)
      .map((item: any) => item.detail.desa)
      .sort();
    setFilteredDesa(filtered);
    setPickerVisible(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleGetCurrentLocation = async () => {
    try {
      setSubmitting(true);
      let location = await Location.getCurrentPositionAsync({});
      const coordStr = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
      updateField(type === 'peti' ? 'lokasi_koordinat' : 'titik_kordinat_tambang', coordStr);
      Alert.alert('Sukses', 'Lokasi berhasil diambil.');
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil lokasi. Pastikan GPS aktif.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePickImage = async (key: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(prev => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      updateField(currentDateField, dateStr);
    }
  };

  const handleSubmit = async () => {
    if (!formData.kecamatan || !formData.desa) {
      Alert.alert('Peringatan', 'Kecamatan dan Desa wajib diisi.');
      return;
    }
    setSubmitting(true);
    
    try {
      const url = type === 'peti' 
        ? 'https://api.bandungkab.go.id/api/form/create/data-pertambangan-tanpa-izin-di-kabupaten-bandung'
        : 'https://api.bandungkab.go.id/api/form/create/data-izin-usaha-pertambangan-dan-surat-izin-penambangan-batuan-kabupaten-bandung';
      
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          payload.append(key, formData[key]);
          payload.append('answers[]', formData[key]); // Fix for "answers wajib diisi" API validation
        }
      });

      if (images.foto1) {
        const ext = images.foto1.split('.').pop();
        payload.append('foto1', {
          uri: images.foto1,
          name: `foto1.${ext || 'jpg'}`,
          type: `image/${ext || 'jpeg'}`
        } as any);
      }

      if (images.foto2) {
        const ext = images.foto2.split('.').pop();
        payload.append('foto2', {
          uri: images.foto2,
          name: `foto2.${ext || 'jpg'}`,
          type: `image/${ext || 'jpeg'}`
        } as any);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // Note: Content-Type is set automatically by fetch when using FormData
        },
        body: payload,
      });

      const json = await response.json();
      setSubmitting(false);

      if (json.status === 'success' || response.ok) {
        Alert.alert('Sukses', 'Data berhasil disimpan!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        let errorMsg = json.message || 'Terjadi kesalahan saat menyimpan data.';
        if (json.errors) {
          const detailedErrors = Object.values(json.errors).flat().join('\n');
          errorMsg += '\n\nDetail:\n' + detailedErrors;
        }
        Alert.alert('Gagal', errorMsg);
      }
    } catch (error) {
      setSubmitting(false);
      Alert.alert('Gagal', 'Terjadi kesalahan jaringan atau server.');
    }
  };

  const openPicker = (type: 'kecamatan' | 'desa') => {
    if (type === 'desa' && !formData.kecamatan) {
      Alert.alert('Peringatan', 'Pilih Kecamatan terlebih dahulu.');
      return;
    }
    setPickerType(type);
    setPickerVisible(true);
  };

  const renderInput = (label: string, field: string, placeholder: string, keyboardType: any = 'default') => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.outline}
        value={formData[field]}
        onChangeText={(text) => updateField(field, text)}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderDateInput = (label: string, field: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          style={styles.input}
          type="date"
          value={formData[field]}
          onChangeText={(text) => updateField(field, text)}
        />
      ) : (
        <TouchableOpacity 
          style={styles.dropdown} 
          onPress={() => {
            setCurrentDateField(field);
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.dropdownText}>{formData[field]}</Text>
          <MaterialCommunityIcons name="calendar" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDropdown = (label: string, field: string, placeholder: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.dropdown} 
        onPress={() => openPicker(field as any)}
      >
        <Text style={[styles.dropdownText, !formData[field] && { color: Colors.light.outline }]}>
          {formData[field] || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color={Colors.light.outline} />
      </TouchableOpacity>
    </View>
  );

  const renderInlineMap = (field: string) => {
    const coordStr = formData[field] || '';
    const parts = coordStr.split(',').map(p => parseFloat(p.trim()));
    const lat = parts.length === 2 && !isNaN(parts[0]) ? parts[0].toString() : '';
    const lng = parts.length === 2 && !isNaN(parts[1]) ? parts[1].toString() : '';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={Colors.light.primary} />
            <Text style={styles.cardTitle}>Lokasi Kunjungan (GPS)</Text>
          </View>
          <TouchableOpacity style={styles.detectBtn} onPress={() => {
            // Re-use existing handleGetCurrentLocation logic
            (async () => {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Akses Ditolak', 'Izinkan akses lokasi untuk menggunakan fitur ini.');
                return;
              }
              const loc = await Location.getCurrentPositionAsync({});
              const coordStr = `${loc.coords.latitude.toFixed(6)}, ${loc.coords.longitude.toFixed(6)}`;
              updateField(field, coordStr);
            })();
          }}>
            <MaterialCommunityIcons name="crosshairs-gps" size={16} color={Colors.light.primary} />
            <Text style={styles.detectBtnText}>Deteksi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.coordInputs}>
          <View style={styles.coordInputWrapper}>
            <Text style={styles.coordLabel}>LATITUDE</Text>
            <TextInput style={styles.coordBox} value={lat} editable={false} placeholder="-" />
          </View>
          <View style={styles.coordInputWrapper}>
            <Text style={styles.coordLabel}>LONGITUDE</Text>
            <TextInput style={styles.coordBox} value={lng} editable={false} placeholder="-" />
          </View>
        </View>

        <View style={styles.inlineMapContainer}>
          {Platform.OS !== 'web' ? (
            <LeafletMap
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: lat ? parseFloat(lat) : -7.025253,
                longitude: lng ? parseFloat(lng) : 107.519760,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              interactive={true}
              tempMarker={lat && lng ? { latitude: parseFloat(lat), longitude: parseFloat(lng) } : undefined}
              onMapPress={(coord) => {
                const newCoordStr = `${coord.latitude.toFixed(6)}, ${coord.longitude.toFixed(6)}`;
                updateField(field, newCoordStr);
              }}
            />
          ) : (
            <View style={styles.webMapPlaceholder}>
              <MaterialCommunityIcons name="map-marker-radius" size={32} color={Colors.light.outline} />
              <Text style={styles.webMapText}>Peta interaktif tersedia di perangkat mobile</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPhotoSection = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons name="camera-outline" size={20} color={Colors.light.primary} />
          <Text style={styles.cardTitle}>Dokumentasi Foto</Text>
        </View>
      </View>

      <Text style={styles.photoSectionLabel}>FOTO 1 (Opsional)</Text>
      <TouchableOpacity style={styles.dashedPhotoBox} onPress={() => handlePickImage('foto1')}>
        {images.foto1 ? (
          <Image source={{ uri: images.foto1 as string }} style={styles.photoPreviewFull} />
        ) : (
          <>
            <MaterialCommunityIcons name="camera" size={24} color={Colors.light.outline} />
            <Text style={styles.dashedPhotoText}>Ambil Foto 1</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.photoSectionLabel}>FOTO 2 (Opsional)</Text>
      <TouchableOpacity style={styles.dashedPhotoBox} onPress={() => handlePickImage('foto2')}>
        {images.foto2 ? (
          <Image source={{ uri: images.foto2 as string }} style={styles.photoPreviewFull} />
        ) : (
          <>
            <MaterialCommunityIcons name="home-outline" size={24} color={Colors.light.outline} />
            <Text style={styles.dashedPhotoText}>Ambil Foto 2</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="close" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'Tambah Data'}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          {type === 'peti' ? (
            <>
              {renderInput('Nama Pelapor', 'pelapor', 'Masukkan nama pelapor')}
              {renderInput('Terlapor / Nama Perusahaan', 'terlapor_atau_nama_perusahaan', 'Masukkan nama perusahaan')}
              {renderDropdown('Kecamatan', 'kecamatan', 'Pilih Kecamatan')}
              {renderDropdown('Desa', 'desa', 'Pilih Desa')}
              {renderInput('Komoditas', 'komoditas', 'Contoh: Tanah Urug')}
              {renderInput('Penanganan / Tindak Lanjut', 'penanganan_atau_tindak_lanjut', 'Masukkan detail penanganan')}
              {renderInput('Tahun Penanganan', 'tahun_penanganan', 'Contoh: 2024', 'numeric')}
              {renderInlineMap('lokasi_koordinat')}
              {renderPhotoSection()}
              {renderInput('Keterangan', 'keterangan', 'Tambahkan keterangan lainnya')}
            </>
          ) : (
            <>
              {renderInput('Nama Pemegang IUP / SIPB', 'nama_pemegang_iup__atau_sipb', 'Masukkan nama pemegang izin')}
              {renderDropdown('Kecamatan', 'kecamatan', 'Pilih Kecamatan')}
              {renderDropdown('Desa', 'desa', 'Pilih Desa')}
              {renderInput('Lokasi Tambang', 'lokasi_tambang', 'Alamat lengkap lokasi tambang')}
              {renderInput('Jenis Perizinan', 'jenis_perizinan', 'Contoh: Operasi Produksi')}
              {renderInput('Komoditas', 'komoditas', 'Contoh: Batuan / Andesit')}
              {renderInput('Nomor SK IUP / SIPB', 'nomor_sk_iup_atau_sipb', 'Masukkan nomor SK')}
              {renderInput('Luas Wilayah (Ha)', 'luas_wilayah_ha', 'Masukkan luas wilayah', 'numeric')}
              {renderDateInput('Tanggal Terbit Izin', 'tanggal_terbit_izin')}
              {renderDateInput('Tanggal Habis Izin', 'tanggal_habis_izin')}
              {renderInput('Status Operasi Produksi', 'status_operasi_produksi', 'Contoh: Aktif / Perpanjangan')}
              {renderInlineMap('titik_kordinat_tambang')}
              {renderPhotoSection()}
            </>
          )}

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Simpan Data</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Region Picker Modal */}
      <Modal visible={pickerVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih {pickerType === 'kecamatan' ? 'Kecamatan' : 'Desa'}</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={pickerType === 'kecamatan' ? kecamatanList : filteredDesa}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.pickerItem} 
                  onPress={() => pickerType === 'kecamatan' ? handleKecamatanSelect(item) : (updateField('desa', item), setPickerVisible(false))}
                >
                  <Text style={styles.pickerItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Map Picker Modal Removed as requested, replaced with inline map */}

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={new Date(formData[currentDateField] || Date.now())}
          mode="date"
          display="default"
          onChange={onDateChange}
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
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.primary,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  dropdownText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.light.text,
  },
  coordContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  coordBtn: {
    backgroundColor: Colors.light.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoPicker: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoLabel: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: Colors.light.outline,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    height: 60,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.text,
  },
  pickerItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.02)',
  },
  pickerItemText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.light.text,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.light.text,
  },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,103,103,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detectBtnText: {
    color: Colors.light.primary,
    fontFamily: Fonts.bold,
    fontSize: 12,
  },
  coordInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  coordInputWrapper: {
    flex: 1,
  },
  coordLabel: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: Colors.light.outline,
    marginBottom: 4,
  },
  coordBox: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontFamily: Fonts.medium,
    color: Colors.light.text,
  },
  inlineMapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e9ecef',
  },
  webMapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  webMapText: {
    fontFamily: Fonts.medium,
    color: Colors.light.outline,
    fontSize: 12,
  },
  photoSectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: Colors.light.outline,
    marginBottom: 8,
    marginTop: 8,
  },
  dashedPhotoBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#ced4da',
    borderRadius: 12,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    gap: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  dashedPhotoText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.light.text,
  },
  photoPreviewFull: {
    width: '100%',
    height: '100%',
  },
});
