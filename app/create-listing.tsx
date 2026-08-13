import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiCall } from '../lib/auth';
import { useI18n } from '../lib/i18n';

const PLAY_CATS = ['leikkikaverit', 'harrastukset', 'seniorit', 'lemmikit'];
const HELP_CATS = ['lumityöt', 'kauppa-asiat', 'korjaukset', 'lemmikkihoito', 'puutarha', 'muu'];

export default function CreateListingScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: string; editId?: string;
    editTitle?: string; editDescription?: string; editCategory?: string;
    editTags?: string; editHelpType?: string; editMinAge?: string; editMaxAge?: string;
  }>();
  const isHelp = params.type === 'help';
  const isEditing = !!params.editId;

  const [title, setTitle] = useState(params.editTitle || '');
  const [description, setDescription] = useState(params.editDescription || '');
  const [category, setCategory] = useState(params.editCategory || (isHelp ? 'muu' : 'leikkikaverit'));
  const [helpType, setHelpType] = useState<'request' | 'offer'>((params.editHelpType as any) || 'request');
  const [minAge, setMinAge] = useState(params.editMinAge || '');
  const [maxAge, setMaxAge] = useState(params.editMaxAge || '');
  const [tags, setTags] = useState(params.editTags || '');
  const [loading, setLoading] = useState(false);

  const categories = isHelp ? HELP_CATS : PLAY_CATS;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(t('common.error'), 'Täytä otsikko ja kuvaus');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        // UPDATE existing listing
        const endpoint = isHelp ? `/api/help-listings/${params.editId}` : `/api/play-listings/${params.editId}`;
        const body: any = { title, description, category, tags: tags.split(',').map(t => t.trim()).filter(Boolean) };
        if (isHelp) body.help_type = helpType;
        else {
          if (minAge) body.child_age_min = parseInt(minAge);
          if (maxAge) body.child_age_max = parseInt(maxAge);
        }
        await apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        // CREATE new listing
        const endpoint = isHelp ? '/api/help-listings' : '/api/play-listings';
        const body: any = { title, description, category, tags: tags.split(',').map(t => t.trim()).filter(Boolean) };
        if (isHelp) body.help_type = helpType;
        else {
          if (minAge) body.child_age_min = parseInt(minAge);
          if (maxAge) body.child_age_max = parseInt(maxAge);
        }
        await apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) });
      }
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
          <TouchableOpacity testID="back-btn" onPress={() => router.back()}>
            <Text style={styles.backText}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? `✏️ ${t('common.edit')}` : t('create.listing_title')}</Text>
        </View>

        {isHelp && (
          <View style={styles.typeRow}>
            <TouchableOpacity testID="type-request" style={[styles.typePill, helpType === 'request' && styles.typePillActive]} onPress={() => setHelpType('request')}>
              <Text style={[styles.typePillText, helpType === 'request' && styles.typePillTextActive]}>🙋 {t('create.request')}</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="type-offer" style={[styles.typePill, helpType === 'offer' && styles.typePillActive]} onPress={() => setHelpType('offer')}>
              <Text style={[styles.typePillText, helpType === 'offer' && styles.typePillTextActive]}>🤝 {t('create.offer')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.field}><Text style={styles.label}>{t('create.title')}</Text>
          <TextInput testID="listing-title" style={styles.input} value={title} onChangeText={setTitle} placeholder="..." />
        </View>
        <View style={styles.field}><Text style={styles.label}>{t('create.description')}</Text>
          <TextInput testID="listing-desc" style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="..." multiline numberOfLines={4} />
        </View>
        <View style={styles.field}><Text style={styles.label}>{t('create.category')}</Text>
          <View style={styles.catRow}>
            {categories.map(c => (
              <TouchableOpacity key={c} testID={`cat-${c}`} style={[styles.catPill, category === c && styles.catPillActive]} onPress={() => setCategory(c)}>
                <Text style={[styles.catPillText, category === c && styles.catPillTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!isHelp && (
          <View style={styles.ageRow}>
            <View style={styles.ageField}><Text style={styles.label}>{t('create.min_age')}</Text>
              <TextInput testID="min-age" style={styles.input} value={minAge} onChangeText={setMinAge} keyboardType="numeric" placeholder="0" />
            </View>
            <View style={styles.ageField}><Text style={styles.label}>{t('create.max_age')}</Text>
              <TextInput testID="max-age" style={styles.input} value={maxAge} onChangeText={setMaxAge} keyboardType="numeric" placeholder="10" />
            </View>
          </View>
        )}

        <View style={styles.field}><Text style={styles.label}>{t('create.tags')}</Text>
          <TextInput testID="listing-tags" style={styles.input} value={tags} onChangeText={setTags} placeholder={t('create.tags_hint')} />
        </View>

        <TouchableOpacity testID="submit-listing" style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.btnText}>{isEditing ? `${t('common.save')}` : t('create.publish')}</Text>
          )}
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
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typePill: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#F5EDE6', borderWidth: 2, borderColor: 'transparent' },
  typePillActive: { backgroundColor: '#FFF5EE', borderColor: '#C4632A' },
  typePillText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  typePillTextActive: { color: '#C4632A' },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1f2937' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5EDE6' },
  catPillActive: { backgroundColor: '#C4632A' },
  catPillText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  catPillTextActive: { color: '#fff' },
  ageRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  ageField: { flex: 1 },
  btn: { backgroundColor: '#C4632A', borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
