import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth, apiCall } from '../../lib/auth';
import { useI18n } from '../../lib/i18n';

export default function EventDetailScreen() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => { fetchEvent(); }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await apiCall(`/api/events/${id}`);
      setEvent(data);
    } catch (e: any) { Alert.alert(t('common.error'), e.message); }
    setLoading(false);
  };

  const handleRSVP = async (status: string) => {
    setRsvpLoading(true);
    try {
      await apiCall(`/api/events/${id}/rsvp`, { method: 'POST', body: JSON.stringify({ status }) });
      fetchEvent();
    } catch (e: any) { Alert.alert(t('common.error'), e.message); }
    setRsvpLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#C4632A" /></View>;
  if (!event) return <View style={styles.center}><Text>Event not found</Text></View>;

  const date = new Date(event.starts_at);
  const goingCount = event.participants?.filter((p: any) => p.status === 'going').length || 0;
  const maybeCount = event.participants?.filter((p: any) => p.status === 'maybe').length || 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity testID="event-back" onPress={() => router.back()}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>

        <View style={styles.heroCard}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>{date.getDate()}</Text>
            <Text style={styles.dateMonth}>{date.toLocaleString('fi-FI', { month: 'short' })}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventMeta}>📍 {event.location_address}</Text>
          <Text style={styles.eventMeta}>🕐 {date.toLocaleString('fi-FI', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</Text>
          {event.distance && <Text style={styles.eventDist}>{event.distance}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.descTitle}>{t('create.description')}</Text>
          <Text style={styles.desc}>{event.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.descTitle}>{t('events.participants')} ({goingCount})</Text>
          <View style={styles.rsvpRow}>
            <Text style={styles.rsvpStat}>✅ {goingCount} {t('events.going')}</Text>
            <Text style={styles.rsvpStat}>🤔 {maybeCount} {t('events.maybe')}</Text>
          </View>
          {(event.participants || []).filter((p: any) => p.status === 'going').map((p: any, i: number) => (
            <View key={i} style={styles.participantRow}>
              <View style={styles.pAvatar}><Text style={styles.pAvatarText}>{(p.display_name || '?')[0]}</Text></View>
              <Text style={styles.pName}>{p.display_name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.rsvpSection}>
          <Text style={styles.rsvpLabel}>{event.my_rsvp ? `Status: ${event.my_rsvp}` : 'RSVP'}</Text>
          <View style={styles.rsvpBtns}>
            {(['going', 'maybe', 'not_going'] as const).map(status => (
              <TouchableOpacity key={status} testID={`rsvp-${status}`}
                style={[styles.rsvpBtn, event.my_rsvp === status && styles.rsvpBtnActive]}
                onPress={() => handleRSVP(status)} disabled={rsvpLoading}>
                <Text style={[styles.rsvpBtnText, event.my_rsvp === status && styles.rsvpBtnTextActive]}>
                  {t(`events.${status === 'not_going' ? 'not_going' : status}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBF6F1' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  backText: { fontSize: 16, color: '#C4632A', fontWeight: '600', paddingTop: 8, paddingBottom: 16 },
  heroCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, marginBottom: 16 },
  dateBadge: { width: 64, height: 68, borderRadius: 18, backgroundColor: '#FFF5EE', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD6B8', marginBottom: 16 },
  dateDay: { fontSize: 28, fontWeight: '800', color: '#C4632A' },
  dateMonth: { fontSize: 13, fontWeight: '600', color: '#D4793E', textTransform: 'capitalize' },
  eventTitle: { fontSize: 22, fontWeight: '700', color: '#1f2937', textAlign: 'center', marginBottom: 8 },
  eventMeta: { fontSize: 15, color: '#4b5563', marginBottom: 4 },
  eventDist: { fontSize: 14, fontWeight: '600', color: '#C4632A', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  descTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  desc: { fontSize: 15, color: '#374151', lineHeight: 22 },
  rsvpRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  rsvpStat: { fontSize: 14, color: '#6b7280' },
  participantRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 10 },
  pAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFE8D6', justifyContent: 'center', alignItems: 'center' },
  pAvatarText: { fontSize: 14, fontWeight: '700', color: '#C4632A' },
  pName: { fontSize: 14, color: '#1f2937', fontWeight: '500' },
  rsvpSection: { alignItems: 'center', marginTop: 8 },
  rsvpLabel: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  rsvpBtns: { flexDirection: 'row', gap: 10 },
  rsvpBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, backgroundColor: '#F5EDE6', borderWidth: 2, borderColor: 'transparent' },
  rsvpBtnActive: { backgroundColor: '#FFF5EE', borderColor: '#C4632A' },
  rsvpBtnText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  rsvpBtnTextActive: { color: '#C4632A' },
});
