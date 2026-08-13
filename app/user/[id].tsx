import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiCall } from '../../lib/auth';
import { useI18n } from '../../lib/i18n';

export default function UserProfileScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => { fetchProfile(); }, [id]);

  const fetchProfile = async () => {
    try {
      const data = await apiCall(`/api/profiles/${id}`);
      setProfile(data);
    } catch {}
    setLoading(false);
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await apiCall('/api/reports', {
        method: 'POST', body: JSON.stringify({ target_type: 'profile', target_id: id, reason: reportReason }),
      });
      setReportModal(false);
      setReportReason('');
      Alert.alert(t('common.success'), 'Report submitted');
    } catch (e: any) { Alert.alert(t('common.error'), e.message); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#C4632A" /></View>;
  if (!profile) return <View style={styles.center}><Text>User not found</Text></View>;

  const counts = profile.listing_counts || {};

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity testID="user-back" onPress={() => router.back()}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(profile.display_name || '?')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{profile.display_name}</Text>
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
          <Text style={styles.city}>📍 {profile.location_city || ''}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNum}>{counts.play || 0}</Text><Text style={styles.statLabel}>{t('profile.play_listings')}</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>{counts.help || 0}</Text><Text style={styles.statLabel}>{t('profile.help_listings')}</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>{counts.events || 0}</Text><Text style={styles.statLabel}>{t('profile.events_count')}</Text></View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity testID="report-user" style={styles.reportBtn} onPress={() => setReportModal(true)}>
            <Text style={styles.reportText}>{t('common.report')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={reportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('common.report')}</Text>
            <TextInput testID="report-reason" style={styles.modalInput} value={reportReason} onChangeText={setReportReason}
              placeholder="Reason..." multiline numberOfLines={3} />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setReportModal(false)}>
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="submit-report" style={styles.modalSubmit} onPress={handleReport}>
                <Text style={styles.modalSubmitText}>{t('common.send')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBF6F1' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  backText: { fontSize: 16, color: '#C4632A', fontWeight: '600', paddingTop: 8, paddingBottom: 16 },
  profileCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFE8D6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#C4632A' },
  name: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  bio: { fontSize: 15, color: '#6b7280', marginTop: 4, textAlign: 'center' },
  city: { fontSize: 14, color: '#C4632A', fontWeight: '600', marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '700', color: '#C4632A' },
  statLabel: { fontSize: 11, color: '#9ca3af', marginTop: 4, textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flex: 2, backgroundColor: '#C4632A', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  contactText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  reportBtn: { flex: 1, backgroundColor: '#fef2f2', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  reportText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937', marginBottom: 16 },
  modalInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalCancel: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#F5EDE6' },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalSubmit: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#C4632A' },
  modalSubmitText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
