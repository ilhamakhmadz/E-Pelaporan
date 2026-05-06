import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Decorative background glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top Illustration Section */}
          <View style={styles.illustrationContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6ZVrXxof-jWOLXP0dkfmr2pLIGrnFrPp_ePdto5MXoZ6b1Fqfwrnvao0TkG9NoS0iWta0J41n6xHi3gw5Ff6IrZrwk-EbILuQ0y8zNdCElNH4RHRihyX2ffEJpY3crY1z3XnTO-XGs1FEAFSxFwbK5esuxr1FiLjOUYa7kPcvZQFnclRhdyy13sz199V9FgMZAjknPwfBRoFJaQGV3SlFB-huMkNgRi3aDtR1_KGrGbbMkzWuCFPfvCb8te-QkYYK0ker-3aUvaI' }}
              style={styles.illustration}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', Colors.light.background]}
              style={styles.illustrationGradient}
            />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Portal Petugas</Text>
            <Text style={styles.subtitle}>
              Akses sistem pengawasan pertambangan terpadu.
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color={Colors.light.outline}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username atau NIP"
                placeholderTextColor={Colors.light.outline}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={24}
                color={Colors.light.outline}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Kata Sandi"
                placeholderTextColor={Colors.light.outline}
                secureTextEntry
              />
              <TouchableOpacity style={styles.eyeIcon}>
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={24}
                  color={Colors.light.outline}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Lupa Password</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonInner}>
                  <Text style={styles.buttonText}>Masuk ke Dashboard</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <Text style={styles.noAccountText}>Belum memiliki akun akses?</Text>
            <TouchableOpacity>
              <Text style={styles.contactAdminText}>HUBUNGI ADMINISTRATOR</Text>
            </TouchableOpacity>
          </View>

          {/* Brand Footer */}
          <View style={styles.footer}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={18}
              color={Colors.light.primary}
            />
            <Text style={styles.footerText}>KABUPATEN BANDUNG • 2024</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(0, 103, 103, 0.05)',
    borderRadius: 150,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(0, 108, 71, 0.05)',
    borderRadius: 150,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  illustrationContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 60,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    elevation: 10,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  illustrationGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: Fonts.extraBold,
    fontSize: 36,
    color: Colors.light.primary,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.light.onSurfaceVariant,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 30,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.light.primary,
    textTransform: 'uppercase',
  },
  loginButton: {
    marginTop: 24,
    borderRadius: 999,
    overflow: 'hidden',
    padding: 1,
  },
  buttonGradient: {
    borderRadius: 999,
    padding: 1,
  },
  buttonInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.light.primary,
  },
  secondaryActions: {
    marginTop: 40,
    alignItems: 'center',
  },
  noAccountText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'rgba(62, 73, 73, 0.6)',
  },
  contactAdminText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.light.outline,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 0.4,
  },
  footerText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.light.text,
    letterSpacing: 2,
  },
});
