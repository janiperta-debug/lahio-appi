import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth, apiCall } from '../../lib/auth';
import { useI18n } from '../../lib/i18n';

const NEIGHBOUR_CATS = [
  { key: 'all', emoji: '', label: 'common.all' },
  { key: 'leikkikaverit', emoji: '🧒', label: 'neighbours.play_companions' },
  { key: 'harrastukset', emoji: '🌱', label: 'neighbours.hobbies' },
  { key: 'seniorit', emoji: '👴', label: 'neighbours.seniors' },
  { key: 'lemmikit', emoji: '🐕', label: 'neighbours.pets' },
];

const HELP_CATS = [
  { key: 'all', emoji: '', label: 'common.all' },
  { key: 'lumityöt', emoji: '🌨️', label: 'help.snow' },
  { key: 'kauppa-asiat', emoji: '🛒', label: 'help.shopping' },
  { key: 'korjaukset', emoji: '🔧', label: 'help.repairs' },
  { key: 'lemmikkihoito', emoji: '🐕', label: 'help.pet_care' },
  { key: 'puutarha', emoji: '🌱', label: 'help.garden' },
];

export default function NeighboursTab() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [section, setSection] = useState<'neighbours' | 'help'>('neighbours');
  const [category, setCategory] = useState('all');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      if (section === 'neighbours') {
        const data = await apiCall(`/api/play-listings${category !== 'all' ? `?category=${category}` : ''}`);
        setListings(data.listings || []);
      } else {
        const data = await apiCall(`/api/help-listings${category !== 'all' ? `?category=${category}` : ''}`);
        setListings(data.listings || []);
      }
      const s = await apiCall('/api/stats');
      setStats(s);
    } catch (e) { console.error(e); }
    setLoading(false);
    setRefreshing(false);
  }, [section, category]);

  useEffect(() => { setLoading(true); fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };
  const categories = section === 'neighbours' ? NEIGHBOUR_CATS : HELP_CATS;

  const renderCard = ({ item }: { item: any }) => (
    <TouchableOpacity testID={`listing-card-${item.id}`} style={styles.card} activeOpacity={0.8}
      onPress={() => router.push(`/user/${item.user_id}`)}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(item.author_name || '?')[0].toUpperCase()}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.authorName}>{item.author_name || 'Unknown'}</Text>
          <Text style={styles.authorBio}>{item.author_bio || item.location_city || ''}</Text>
        </View>
        {item.distance ? (
          <View style={styles.distBadge}>
            <Text style={styles.distText}>📍 {item.distance}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>
      <View style={styles.tagRow}>
        {(item.tags || []).slice(0, 3).map((tag: string, i: number) => (
          <View key={i} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
        ))}
      </View>
      {section === 'help' && item.help_type === 'request' && (item.tags || []).includes('Kiireellinen') && (
        <View style={styles.urgentBadge}><Text style={styles.urgentText}>{t('help.urgent')}</Text></View>
      )}
      <View style={styles.cardFooter}>
        <Text style={styles.timeText}>{item.created_at ? getTimeAgo(item.created_at, t) : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{section === 'neighbours' ? t('neighbours.title') : t('help.title')}</Text>
          <Text style={styles.headerSub}>{user?.location_city || ''} · {user?.search_radius_km || 5} km {t('neighbours.radius_label')}</Text>
        </View>
        <TouchableOpacity testID="create-listing-fab" style={styles.fabSmall}
          onPress={() => router.push({ pathname: '/create-listing', params: { type: section === 'help' ? 'help' : 'play' } })}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionToggle}>
        <TouchableOpacity testID="section-neighbours" style={[styles.sectionBtn, section === 'neighbours' && styles.sectionActive]}
          onPress={() => { setSection('neighbours'); setCategory('all'); }}>
          <Text style={[styles.sectionText, section === 'neighbours' && styles.sectionTextActive]}>{t('neighbours.neighbours_section')}</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="section-help" style={[styles.sectionBtn, section === 'help' && styles.sectionActive]}
          onPress={() => { setSection('help'); setCategory('all'); }}>
          <Text style={[styles.sectionText, section === 'help' && styles.sectionTextActive]}>{t('neighbours.help_section')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={c => c.key}
        showsHorizontalScrollIndicator={false}
        style={styles.catList}
        contentContainerStyle={styles.catContent}
        renderItem={({ item: c }) => (
          <TouchableOpacity testID={`cat-${c.key}`} style={[styles.catChip, category === c.key && styles.catChipActive]}
            onPress={() => setCategory(c.key)}>
            <Text style={[styles.catText, category === c.key && styles.catTextActive]}>{c.emoji ? `${c.emoji} ` : ''}{t(c.label)}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#C4632A" /></View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C4632A" />}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>🌿</Text><Text style={styles.emptySubtext}>No listings yet</Text></View>}
          ListFooterComponent={stats ? (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>{t('neighbours.area_stats')}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}><Text style={styles.statNum}>{stats.neighbours}</Text><Text style={styles.statLabel}>{t('neighbours.neighbours_count')}</Text></View>
                <View style={styles.statItem}><Text style={styles.statNum}>{stats.play_listings + stats.help_listings}</Text><Text style={styles.statLabel}>{t('neighbours.new_count')}</Text></View>
                <View style={styles.statItem}><Text style={styles.statNum}>{stats.radius_km}</Text><Text style={styles.statLabel}>Km {t('neighbours.radius_label')}</Text></View>
              </View>
            </View>
          ) : null}
        />
      )}
    </SafeAreaView>
  );
}

function getTimeAgo(isoString: string, t: (k: string) => string) {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return t('neighbours.active_today');
  const days = Math.floor(hours / 24);
  if (days === 1) return t('neighbours.yesterday');
  return `${days} ${t('neighbours.days_ago')}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1f2937' },
  headerSub: { fontSize: 14, color: '#9ca3af', marginTop: 2 },
  fabSmall: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#C4632A', justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 24, fontWeight: '600', marginTop: -2 },
  sectionToggle: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#F5EDE6', borderRadius: 16, padding: 4, marginBottom: 8 },
  sectionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  sectionActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  sectionText: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  sectionTextActive: { color: '#C4632A' },
  catList: { maxHeight: 48, marginBottom: 4 },
  catContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  catChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#F5EDE6' },
  catChipActive: { backgroundColor: '#C4632A' },
  catText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  catTextActive: { color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFE8D6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#C4632A' },
  cardMeta: { flex: 1, marginLeft: 12 },
  authorName: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  authorBio: { fontSize: 13, color: '#9ca3af', marginTop: 1 },
  distBadge: { backgroundColor: '#FFF5EE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#FFD6B8' },
  distText: { fontSize: 12, fontWeight: '700', color: '#C4632A' },
  cardDesc: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 10 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: { backgroundColor: '#F5EDE6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  tagText: { fontSize: 12, fontWeight: '600', color: '#4b5563' },
  urgentBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  urgentText: { fontSize: 12, fontWeight: '700', color: '#ef4444' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#9ca3af' },
  contactBtn: { backgroundColor: '#C4632A', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  contactText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 48 },
  emptySubtext: { fontSize: 16, color: '#9ca3af', marginTop: 8 },
  statsCard: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  statsTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '700', color: '#C4632A' },
  statLabel: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
});
