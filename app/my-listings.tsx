import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiCall } from '../lib/auth';
import { useI18n } from '../lib/i18n';

export default function MyListingsScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<'play' | 'help'>('play');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      const endpoint = tab === 'play' ? '/api/play-listings/mine' : '/api/help-listings/mine';
      const data = await apiCall(endpoint);
      setListings(data.listings || []);
    } catch (e) { console.error(e); }
    setLoading(false);
    setRefreshing(false);
  }, [tab]);

  useEffect(() => { setLoading(true); fetchListings(); }, [fetchListings]);

  const handleDelete = (item: any) => {
    const endpoint = tab === 'play' ? `/api/play-listings/${item.id}` : `/api/help-listings/${item.id}`;
    Alert.alert(
      t('common.delete'),
      `"${item.title}" — ${t('common.confirm')}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'), style: 'destructive',
          onPress: async () => {
            try {
              await apiCall(endpoint, { method: 'DELETE' });
              setListings(prev => prev.filter(l => l.id !== item.id));
            } catch (e: any) { Alert.alert(t('common.error'), e.message); }
          },
        },
      ]
    );
  };

  const handleEdit = (item: any) => {
    router.push({
      pathname: '/create-listing',
      params: {
        type: tab, editId: item.id,
        editTitle: item.title, editDescription: item.description,
        editCategory: item.category, editTags: (item.tags || []).join(', '),
        editHelpType: item.help_type || '',
        editMinAge: item.child_age_min != null ? String(item.child_age_min) : '',
        editMaxAge: item.child_age_max != null ? String(item.child_age_max) : '',
      },
    });
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'active' ? 'paused' : 'active';
    const endpoint = tab === 'play' ? `/api/play-listings/${item.id}` : `/api/help-listings/${item.id}`;
    try {
      await apiCall(endpoint, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      setListings(prev => prev.map(l => l.id === item.id ? { ...l, status: newStatus } : l));
    } catch (e: any) { Alert.alert(t('common.error'), e.message); }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isPaused = item.status === 'paused';
    return (
      <View testID={`my-listing-${item.id}`} style={[styles.card, isPaused && styles.cardPaused]}>
        <View style={styles.cardTop}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.statusBadge, isPaused ? styles.statusPaused : styles.statusActive]}>
                <Text style={[styles.statusText, isPaused ? styles.statusTextPaused : styles.statusTextActive]}>
                  {isPaused ? '⏸ Tauolla' : '✅ Aktiivinen'}
                </Text>
              </View>
              <Text style={styles.dateText}>
                {item.created_at ? new Date(item.created_at).toLocaleDateString('fi-FI') : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity testID={`toggle-${item.id}`} style={styles.actionBtn} onPress={() => handleToggleStatus(item)}>
            <Text style={styles.actionText}>{isPaused ? '▶️ Aktivoi' : '⏸ Tauko'}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID={`edit-${item.id}`} style={styles.actionBtn} onPress={() => handleEdit(item)}>
            <Text style={styles.actionText}>✏️ {t('common.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID={`delete-${item.id}`} style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item)}>
            <Text style={styles.deleteText}>🗑 {t('common.delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity testID="my-listings-back" onPress={() => router.back()}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile.my_listings')}</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity testID="tab-play" style={[styles.tabBtn, tab === 'play' && styles.tabActive]}
          onPress={() => setTab('play')}>
          <Text style={[styles.tabText, tab === 'play' && styles.tabTextActive]}>🧒 {t('profile.play_listings')}</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="tab-help" style={[styles.tabBtn, tab === 'help' && styles.tabActive]}
          onPress={() => setTab('help')}>
          <Text style={[styles.tabText, tab === 'help' && styles.tabTextActive]}>🤝 {t('profile.help_listings')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#C4632A" /></View>
      ) : (
        <FlatList data={listings} keyExtractor={item => item.id} renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchListings(); }} tintColor="#C4632A" />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>{tab === 'play' ? '🧒' : '🤝'}</Text>
              <Text style={styles.emptyText}>Ei ilmoituksia vielä</Text>
              <TouchableOpacity testID="create-from-empty" style={styles.createBtn}
                onPress={() => router.push({ pathname: '/create-listing', params: { type: tab } })}>
                <Text style={styles.createBtnText}>+ Lisää ilmoitus</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backText: { fontSize: 16, color: '#C4632A', fontWeight: '600', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  tabRow: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#F5EDE6', borderRadius: 16, padding: 4, marginBottom: 12 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  tabTextActive: { color: '#C4632A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  cardPaused: { opacity: 0.7 },
  cardTop: { marginBottom: 12 },
  cardInfo: { gap: 4 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1f2937' },
  cardDesc: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusActive: { backgroundColor: '#FFF5EE' },
  statusPaused: { backgroundColor: '#fef3c7' },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusTextActive: { color: '#C4632A' },
  statusTextPaused: { color: '#92400e' },
  dateText: { fontSize: 12, color: '#9ca3af' },
  actions: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#F5EDE6' },
  actionText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  deleteBtn: { backgroundColor: '#fef2f2' },
  deleteText: { fontSize: 13, fontWeight: '600', color: '#ef4444' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#9ca3af' },
  createBtn: { backgroundColor: '#C4632A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
  createBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
