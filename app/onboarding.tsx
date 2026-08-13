import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth';
import { apiCall } from '../lib/auth';
import { useI18n } from '../lib/i18n';

export default function OnboardingScreen() {
  const { updateUser, refreshUser } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geocoded, setGeocoded] = useState<{lat: number; lon: number; display: string} | null>(null);

  const radiusOptions = [1, 2, 3, 5, 10, 15, 25, 50];

  const handleGeocode = async () => {
    if (!address.trim()) return;
    setGeocoding(true);
    try {
      const data = await apiCall(`/api/geocode?address=${encodeURIComponent(address + (city ? ', ' + city : ', Finland'))}`);
      setGeocoded({ lat: data.latitude, lon: data.longitude, display: data.display_name });
      if (!city && data.display_name) {
        const parts = data.display_name.split(',');
        const cityName = parts.length > 2 ? parts[parts.length - 3]?.trim() : parts[0]?.trim();
        if (cityName) setCity(cityName);
      }
    } catch {
      Alert.alert(t('common.error'), 'Address not found');
    }
    setGeocoding(false);
  };

  const handleSave = async () => {
    if (!geocoded) {
      await handleGeocode();
      return;
    }
    setLoading(true);
    try {
      const result = await apiCall('/api/profiles/update-location', {
        method: 'POST',
        body: JSON.stringify({ latitude: geocoded.lat, longitude: geocoded.lon, city: city || 'Unknown', search_radius_km: radius }),
      });
      updateUser({ location_city: result.location_city || city, search_radius_km: radius });
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert(t('common.error'), e.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.emoji}>📍</Text>
          <Text style={styles.title}>{t('onboarding.welcome')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('onboarding.city')}</Text>
            <TextInput testID="onboarding-city" style={styles.input} value={city} onChangeText={setCity} placeholder="Hyvinkää" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('onboarding.address')}</Text>
            <TextInput testID="onboarding-address" style={styles.input} value={address} onChangeText={(v) => { setAddress(v); setGeocoded(null); }}
              placeholder="Hämeenkatu 1" />
          </View>

          <TouchableOpacity testID="geocode-btn" style={styles.geocodeBtn} onPress={handleGeocode} disabled={geocoding}>
            {geocoding ? <ActivityIndicator color="#C4632A" size="small" /> : <Text style={styles.geocodeBtnText}>🔍 {t('onboarding.set_location')}</Text>}
          </TouchableOpacity>

          {geocoded && (
            <View style={styles.geocodeResult}>
              <Text style={styles.checkmark}>✅</Text>
              <Text style={styles.geocodeText} numberOfLines={2}>{geocoded.display}</Text>
            </View>
          )}

          <View style={styles.radiusSection}>
            <Text style={styles.label}>{t('onboarding.radius')}: {radius} {t('onboarding.km')}</Text>
            <Text style={styles.hint}>{t('onboarding.radius_hint')}</Text>
            <View style={styles.radiusPills}>
              {radiusOptions.map((r) => (
                <TouchableOpacity key={r} testID={`radius-${r}`} style={[styles.pill, radius === r && styles.pillActive]} onPress={() => setRadius(r)}>
                  <Text style={[styles.pillText, radius === r && styles.pillTextActive]}>{r} km</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity testID="onboarding-save" style={[styles.btn, !geocoded && styles.btnDisabled]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{geocoded ? t('common.save') : t('onboarding.set_location')}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 32 },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#C4632A', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#4b5563', marginTop: 8, textAlign: 'center', lineHeight: 22 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1f2937' },
  geocodeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#C4632A', borderStyle: 'dashed' },
  geocodeBtnText: { fontSize: 15, color: '#C4632A', fontWeight: '600' },
  geocodeResult: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5EE', padding: 12, borderRadius: 12, gap: 8 },
  checkmark: { fontSize: 18 },
  geocodeText: { fontSize: 13, color: '#B85C2B', flex: 1 },
  radiusSection: { gap: 8 },
  hint: { fontSize: 13, color: '#9ca3af' },
  radiusPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#F5EDE6' },
  pillActive: { backgroundColor: '#C4632A' },
  pillText: { fontSize: 14, fontWeight: '600', color: '#4b5563' },
  pillTextActive: { color: '#fff' },
  btn: { backgroundColor: '#C4632A', borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnDisabled: { backgroundColor: '#9ca3af' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
