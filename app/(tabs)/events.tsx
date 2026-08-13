import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth, apiCall } from '../../lib/auth';
import { useI18n } from '../../lib/i18n';

const CATS = [
  { key: 'all', emoji: '', label: 'common.all' },
  { key: 'lapsille', emoji: '🧒', label: 'events.for_kids' },
  { key: 'liikunta', emoji: '🚶', label: 'events.sports' },
  { key: 'kulttuuri', emoji: '🎨', label: 'events.culture' },
  { key: 'kokoontuminen', emoji: '☕', label: 'events.gathering' },
];

export default function EventsTab() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await apiCall(`/api/events${category !== 'all' ? `?category=${category}` : ''}`);
      setEvents(data.events || []);
    } catch (e) { console.error(e); }
    setLoading(false);
    setRefreshing(false);
  }, [category]);

  useEffect(() => { setLoading(true); fetchEvents(); }, [fetchEvents]);

  const renderEvent = ({ item }: { item: any }) => {
    const date = new Date(item.starts_at);
    const day = date.getDate();
    const monthShort = date.toLocaleString('fi-FI', { month: 'short' }).substring(0, 3);
    const time = date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });

    return (
      <TouchableOpacity testID={`event-card-${item.id}`} style={styles.card} activeOpacity={0.8}
        onPress={() => router.push(`/event/${item.id}`)}>
        <View style={styles.cardRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>{day}</Text>
            <Text style={styles.dateMonth}>{monthShort}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.eventLocation}>📍 {item.location_address} · {time}</Text>
            <View style={styles.eventMeta}>
              <Text style={styles.metaText}>👥 {item.participant_count || 0} {t('events.participants')}</Text>
              <Text style={styles.metaBadge}>{t('common.free')}</Text>
              {item.distance ? <Text style={styles.metaDist}>{item.distance}</Text> : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('events.title')}</Text>
          <Text style={styles.headerSub}>{user?.location_city || ''} · {t('events.upcoming')}</Text>
        </View>
        <TouchableOpacity testID="create-event-fab" style={styles.fabSmall} onPress={() => router.push('/create-event')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList horizontal data={CATS} keyExtractor={c => c.key} showsHorizontalScrollIndicator={false}
        style={styles.catList} contentContainerStyle={styles.catContent}
        renderItem={({ item: c }) => (
          <TouchableOpacity testID={`event-cat-${c.key}`} style={[styles.catChip, category === c.key && styles.catChipActive]}
            onPress={() => setCategory(c.key)}>
            <Text style={[styles.catText, category === c.key && styles.catTextActive]}>{c.emoji ? `${c.emoji} ` : ''}{t(c.label)}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#C4632A" /></View>
      ) : (
        <FlatList data={events} keyExtractor={item => item.id} renderItem={renderEvent}
          contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEvents(); }} tintColor="#C4632A" />}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyEmoji}>📅</Text><Text style={styles.emptyText}>No events yet</Text></View>}
          ListFooterComponent={
            <View style={styles.organizeCard}>
              <Text style={styles.organizeTitle}>{t('events.organize')}</Text>
              <Text style={styles.organizeDesc}>{t('events.organize_desc')}</Text>
              <TouchableOpacity testID="organize-event-btn" style={styles.organizeBtn} onPress={() => router.push('/create-event')}>
                <Text style={styles.organizeBtnText}>+ {t('events.add_event')}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1f2937' },
  headerSub: { fontSize: 14, color: '#9ca3af', marginTop: 2 },
  fabSmall: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#C4632A', justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 24, fontWeight: '600', marginTop: -2 },
  catList: { maxHeight: 48, marginBottom: 4 },
  catContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  catChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#F5EDE6' },
  catChipActive: { backgroundColor: '#C4632A' },
  catText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  catTextActive: { color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  cardRow: { flexDirection: 'row', gap: 14 },
  dateBadge: { width: 52, height: 56, borderRadius: 14, backgroundColor: '#FFF5EE', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD6B8' },
  dateDay: { fontSize: 22, fontWeight: '800', color: '#C4632A' },
  dateMonth: { fontSize: 12, fontWeight: '600', color: '#D4793E', textTransform: 'capitalize' },
  cardContent: { flex: 1, gap: 4 },
  eventTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  eventLocation: { fontSize: 13, color: '#4b5563' },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  metaText: { fontSize: 12, color: '#6b7280' },
  metaBadge: { fontSize: 11, fontWeight: '700', color: '#C4632A', backgroundColor: '#FFF5EE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  metaDist: { fontSize: 12, color: '#C4632A', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#9ca3af', marginTop: 8 },
  organizeCard: { backgroundColor: '#FFF5EE', borderRadius: 18, padding: 20, marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FFD6B8' },
  organizeTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', textAlign: 'center' },
  organizeDesc: { fontSize: 14, color: '#4b5563', textAlign: 'center', marginVertical: 12, lineHeight: 20 },
  organizeBtn: { backgroundColor: '#C4632A', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  organizeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
