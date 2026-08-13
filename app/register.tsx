import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';

const logoImage = require('../assets/images/logo.png');

export default function RegisterScreen() {
  const { register } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      await register(email, password, displayName);
      router.replace('/onboarding');
    } catch (e: any) {
      setError(e.message || t('auth.register_error'));
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.heroSection}>
            <Image source={logoImage} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brand}>Lähellä</Text>
            <Text style={styles.subtitle}>{t('auth.register_title')}</Text>
          </View>

          <View style={styles.form}>
            {error ? <Text testID="register-error" style={styles.error}>{error}</Text> : null}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.display_name')}</Text>
              <TextInput testID="register-name" style={styles.input} value={displayName} onChangeText={setDisplayName}
                placeholder="Matti M." autoCapitalize="words" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.email')}</Text>
              <TextInput testID="register-email" style={styles.input} value={email} onChangeText={setEmail}
                placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <TextInput testID="register-password" style={styles.input} value={password} onChangeText={setPassword}
                placeholder="••••••••" secureTextEntry autoComplete="new-password" />
            </View>
            <TouchableOpacity testID="register-submit" style={styles.btn} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{t('auth.register')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity testID="go-to-login" onPress={() => router.push('/login')} style={styles.linkBtn}>
              <Text style={styles.linkText}>{t('auth.has_account')} <Text style={styles.linkBold}>{t('auth.login')}</Text></Text>
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
