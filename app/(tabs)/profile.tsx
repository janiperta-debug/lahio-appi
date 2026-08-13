import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth, apiCall } from '../../lib/auth';
import { useI18n } from '../../lib/i18n';

export default function ProfileTab() {
  const { user, logout, updateUser } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [counts, setCounts] = useState({ play: 0, help: 0, events: 0 });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setBio(user.bio || '');
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      const [play, help, events] = await Promise.all([
        apiCall('/api/play-listings/mine'), apiCall('/api/help-listings/mine'), apiCall('/api/events/mine'),
      ]);
      setCounts({ play: play.listings?.length || 0, help: help.listings?.length || 0, events: events.events?.length || 0 });
    } catch {}
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiCall('/api/profiles/me', { method: 'PUT', body: JSON.stringify({ display_name: displayName, bio }) });
      updateUser({ display_name: displayName, bio });
      setEditing(false);
    } catch (e: any) { Alert.alert(t('common.error'), e.message); }
    setSaving(false);
  };

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.logout'), style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } },
    ]);
  };

  const handleAvatarPick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Tarvitaan lupa', 'Salli kuvakirjaston käyttö asetuksista');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (result.canceled || !result.assets[0]?.base64) return;
      setUploadingAvatar(true);
      const asset = result.assets[0];
      const mimeType = asset.mimeType || 'image/jpeg';
      const dataUri = `data:${mimeType};base64,${asset.base64}`;
      const resp = await apiCall('/api/profiles/upload-avatar', {
        method: 'POST', body: JSON.stringify({ image_base64: dataUri }),
      });
      updateUser({ avatar_url: resp.avatar_url });
    } catch (e: any) {
      Alert.alert(t('common.error'), e.message || 'Upload failed');
    }
    setUploadingAvatar(false);
  };

  const isLocked = user?.location_locked_until && new Date(user.location_locked_until) > new Date();
  const lockDays = isLocked ? Math.ceil((new Date(user!.location_locked_until!).getTime() - Date.now()) / 86400000) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('profile.my_profile')}</Text>
        <View style={styles.profileCard}>
          <TouchableOpacity testID="avatar-upload" onPress={handleAvatarPick} style={styles.avatarWrap} disabled={uploadingAvatar}>
            {uploadingAvatar ? (
              <View style={styles.avatarLarge}><ActivityIndicator size="small" color="#C4632A" /></View>
            ) : user?.avatar_url && user.avatar_url.startsWith('data:') ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarText}>{(user?.display_name || '?')[0].toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}><Text style={styles.cameraIcon}>📷</Text></View>
          </TouchableOpacity>
          {editing ? (
            <View style={styles.editSection}>
              <TextInput testID="edit-name" style={styles.input} value={displayName} onChangeText={setDisplayName} placeholder={t('auth.display_name')} />
              <TextInput testID="edit-bio" style={[styles.input, styles.bioInput]} value={bio} onChangeText={setBio} placeholder={t('profile.bio')} multiline numberOfLines={3} />
              <View style={styles.editBtns}>
                <TouchableOpacity testID="cancel-edit" style={styles.cancelBtn} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="save-profile" style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>{t('common.save')}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.display_name || ''}</Text>
              <Text style={styles.profileBio}>{user?.bio || ''}</Text>
              <TouchableOpacity testID="edit-profile-btn" style={styles.editBtn} onPress={() => setEditing(true)}>
                <Text style={styles.editBtnText}>{t('profile.edit_profile')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNum}>{counts.play}</Text><Text style={styles.statLabel}>{t('profile.play_listings')}</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>{counts.help}</Text><Text style={styles.statLabel}>{t('profile.help_listings')}</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>{counts.events}</Text><Text style={styles.statLabel}>{t('profile.events_count')}</Text></View>
        </View>

        <TouchableOpacity testID="my-listings-btn" style={styles.myListingsBtn} onPress={() => router.push('/my-listings')}>
          <Text style={styles.myListingsBtnText}>📋 {t('profile.my_listings')}</Text>
          <Text style={styles.myListingsArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.location_status')}</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationCity}>📍 {user?.location_city || 'Not set'}</Text>
            <Text style={styles.locationRadius}>{user?.search_radius_km || 5} km {t('neighbours.radius_label')}</Text>
            {isLocked && (
              <View style={styles.lockBanner}>
                <Text style={styles.lockText}>🔒 {t('profile.location_locked')} — {lockDays} {t('profile.lock_days')}</Text>
              </View>
            )}
            <TouchableOpacity testID="update-location-btn" style={styles.locationBtn} onPress={() => router.push('/onboarding')}>
              <Text style={styles.locationBtnText}>{t('profile.update_location')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
          <View style={styles.langRow}>
            <TouchableOpacity testID="profile-lang-fi" style={[styles.langPill, language === 'fi' && styles.langPillActive]} onPress={() => setLanguage('fi')}>
              <Text style={[styles.langPillText, language === 'fi' && styles.langPillTextActive]}>🇫🇮 Suomi</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="profile-lang-en" style={[styles.langPill, language === 'en' && styles.langPillActive]} onPress={() => setLanguage('en')}>
              <Text style={[styles.langPillText, language === 'en' && styles.langPillTextActive]}>🇬🇧 English</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity testID="logout-btn" style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: '#1f2937', paddingTop: 8, paddingBottom: 16 },
  profileCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFE8D6', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarWrap: { position: 'relative', marginBottom: 16 },
  cameraBadge: { position: 'absolute', bottom: 0, right: -4, backgroundColor: '#C4632A', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  cameraIcon: { fontSize: 14 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#C4632A' },
  profileInfo: { alignItems: 'center' },
  profileName: { fontSize: 22, fontWeight: '700', color: '#1f2937' },
  profileBio: { fontSize: 15, color: '#6b7280', marginTop: 4, textAlign: 'center' },
  editBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#C4632A' },
  editBtnText: { fontSize: 14, fontWeight: '600', color: '#C4632A' },
  editSection: { width: '100%', gap: 12 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
  editBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#F5EDE6' },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#4b5563' },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#C4632A' },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 18, padding: 20, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '700', color: '#C4632A' },
  statLabel: { fontSize: 12, color: '#9ca3af', marginTop: 4, textAlign: 'center' },
  myListingsBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 18, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, borderWidth: 1.5, borderColor: '#FFE8D6' },
  myListingsBtnText: { fontSize: 16, fontWeight: '700', color: '#C4632A' },
  myListingsArrow: { fontSize: 20, color: '#C4632A' },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 12 },
  locationCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  locationCity: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  locationRadius: { fontSize: 14, color: '#6b7280' },
  lockBanner: { backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  lockText: { fontSize: 13, fontWeight: '600', color: '#92400e' },
  locationBtn: { borderWidth: 1.5, borderColor: '#C4632A', borderRadius: 14, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  locationBtnText: { fontSize: 14, fontWeight: '600', color: '#C4632A' },
  langRow: { flexDirection: 'row', gap: 12 },
  langPill: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb' },
  langPillActive: { borderColor: '#C4632A', backgroundColor: '#FFF5EE' },
  langPillText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  langPillTextActive: { color: '#C4632A' },
  logoutBtn: { marginTop: 32, paddingVertical: 16, borderRadius: 14, alignItems: 'center', backgroundColor: '#fef2f2' },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#ef4444' },
});
