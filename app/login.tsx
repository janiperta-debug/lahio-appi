import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';

const logoImage = require('../assets/images/logo.png');

export default function LoginScreen() {
  const { login } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (!user.location_city) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message || t('auth.login_error'));
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.langRow}>
            <TouchableOpacity testID="lang-fi" onPress={() => setLanguage('fi')} style={[styles.langBtn, language === 'fi' && styles.langActive]}>
              <Text style={[styles.langText, language === 'fi' && styles.langTextActive]}>FI</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="lang-en" onPress={() => setLanguage('en')} style={[styles.langBtn, language === 'en' && styles.langActive]}>
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroSection}>
            <Image source={logoImage} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brand}>Lähellä</Text>
            <Text style={styles.subtitle}>{t('auth.login_title')}</Text>
          </View>

          <View style={styles.form}>
            {error ? <Text testID="login-error" style={styles.error}>{error}</Text> : null}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.email')}</Text>
              <TextInput testID="login-email" style={styles.input} value={email} onChangeText={setEmail}
                placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <TextInput testID="login-password" style={styles.input} value={password} onChangeText={setPassword}
                placeholder="••••••••" secureTextEntry autoComplete="password" />
            </View>
            <TouchableOpacity testID="login-submit" style={styles.btn} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{t('auth.login')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity testID="go-to-register" onPress={() => router.push('/register')} style={styles.linkBtn}>
              <Text style={styles.linkText}>{t('auth.no_account')} <Text style={styles.linkBold}>{t('auth.register')}</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 12 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F5EDE6' },
  langActive: { backgroundColor: '#C4632A' },
  langText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  langTextActive: { color: '#fff' },
  heroSection: { alignItems: 'center', marginTop: 48, marginBottom: 40 },
  emoji: { fontSize: 48, marginBottom: 12 },
  logo: { width: 100, height: 100, marginBottom: 12, borderRadius: 50 },
  brand: { fontSize: 36, fontWeight: '700', color: '#C4632A', letterSpacing: -1 },
  subtitle: { fontSize: 18, color: '#4b5563', marginTop: 8 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1f2937' },
  btn: { backgroundColor: '#C4632A', borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  linkBtn: { alignItems: 'center', paddingVertical: 12 },
  linkText: { fontSize: 15, color: '#4b5563' },
  linkBold: { color: '#C4632A', fontWeight: '700' },
  error: { backgroundColor: '#fef2f2', color: '#ef4444', padding: 12, borderRadius: 12, fontSize: 14, textAlign: 'center' },
});
