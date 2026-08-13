import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiCall } from '../lib/auth';
import { useI18n } from '../lib/i18n';

const CATS = ['lapsille', 'liikunta', 'kulttuuri', 'kokoontuminen'];

export default function CreateEventScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('kokoontuminen');
  const [address, setAddress] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [maxPart, setMaxPart] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !address.trim() || !startsAt.trim()) {
      Alert.alert(t('common.error'), 'Fill all required fields');
      return;
    }
    setLoading(true);
    try {
      let dateStr = startsAt;
      if (!dateStr.includes('T')) dateStr = dateStr + 'T12:00:00';
      await apiCall('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          title, description, category, location_address: address,
          starts_at: new Date(dateStr).toISOString(),
          max_participants: maxPart ? parseInt(maxPart) : null,
          recurrence: 'none',
        }),
      });
      router.back();
    } catch (e: any) {
      Alert.alert(t('common.error'), e.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity testID="back-btn" onPress={() => router.back()}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
          <Text style={styles.title}>{t('create.event_title')}</Text>
        </View>

        <View style={styles.field}><Text style={styles.label}>{t('create.title')}</Text>
          <TextInput testID="event-title" style={styles.input} value={title} onChangeText={setTitle} placeholder="Kävelykerho..." />
        </View>
        <View style={styles.field}><Text style={styles.label}>{t('create.description')}</Text>
          <TextInput testID="event-desc" style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="..." multiline numberOfLines={4} />
        </View>
        <View style={styles.field}><Text style={styles.label}>{t('create.category')}</Text>
          <View style={styles.catRow}>
            {CATS.map(c => (
              <TouchableOpacity key={c} testID={`ecat-${c}`} style={[styles.catPill, category === c && styles.catPillActive]} onPress={() => setCategory(c)}>
                <Text style={[styles.catPillText, category === c && styles.catPillTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.field}><Text style={styles.label}>{t('create.location_address')}</Text>
          <TextInput testID="event-address" style={styles.input} value={address} onChangeText={setAddress} placeholder="Kotipolun leikkipuisto..." />
        </View>
        <View style={styles.field}><Text style={styles.label}>{t('create.start_time')} (YYYY-MM-DD HH:MM)</Text>
          <TextInput testID="event-starts" style={styles.input} value={startsAt} onChangeText={setStartsAt} placeholder="2026-03-01 14:00" />
        </View>
        <View style={styles.field}><Text style={styles.label}>{t('create.max_participants')}</Text>
          <TextInput testID="event-max" style={styles.input} value={maxPart} onChangeText={setMaxPart} keyboardType="numeric" placeholder="20" />
        </View>

        <TouchableOpacity testID="submit-event" style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{t('create.publish')}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 20 },
  backText: { fontSize: 16, color: '#C4632A', fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1f2937' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5EDE6' },
  catPillActive: { backgroundColor: '#C4632A' },
  catPillText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  catPillTextActive: { color: '#fff' },
  btn: { backgroundColor: '#C4632A', borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
