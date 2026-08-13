import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { apiCall } from '../lib/auth';
import { useI18n } from '../lib/i18n';

const MODE_EMOJI: Record<string, string> = { BUS: '🚌', TRAM: '🚊', RAIL: '🚂', SUBWAY: '🚇', FERRY: '⛴️' };

export default function TransitScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLon, setGpsLon] = useState<number | null>(null);
  const [radius, setRadius] = useState(0.5);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Sijainnin käyttöoikeus evätty');
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setGpsLat(loc.coords.latitude);
        setGpsLon(loc.coords.longitude);
      } catch {
        // Fallback to Hyvinkää
        setGpsLat(60.6312);
        setGpsLon(24.8614);
      }
    })();
  }, []);

  const fetchStops = useCallback(async () => {
    if (!gpsLat || !gpsLon) return;
    try {
      const data = await apiCall(`/api/transit/nearby-stops?lat=${gpsLat}&lon=${gpsLon}&radius_km=${radius}`);
      setStops(data.stops || []);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Virhe haettaessa aikatauluja');
    }
    setLoading(false);
    setRefreshing(false);
  }, [gpsLat, gpsLon, radius]);

  useEffect(() => {
    if (gpsLat && gpsLon) fetchStops();
  }, [fetchStops]);

  const radiusOptions = [0.3, 0.5, 1, 2, 5];

  const renderStop = ({ item }: { item: any }) => (
    <View testID={`stop-${item.gtfs_id}`} style={styles.stopCard}>
      <View style={styles.stopHeader}>
        <View style={styles.stopNameRow}>
          <Text style={styles.stopIcon}>🚏</Text>
          <Text style={styles.stopName}>{item.name}</Text>
        </View>
        <View style={styles.distBadge}>
          <Text style={styles.distText}>{item.distance}</Text>
        </View>
      </View>
      {item.departures.map((dep: any, i: number) => {
        const emoji = MODE_EMOJI[dep.mode] || '🚌';
        const isLate = dep.delay_min > 0;
        const now = Math.floor(Date.now() / 1000);
        const minsUntil = Math.max(0, Math.floor((dep.departure_ts - now) / 60));
        const timeLabel = minsUntil <= 0 ? 'nyt' : minsUntil < 60 ? `${minsUntil} min` : dep.time;

        return (
          <View key={i} style={styles.depRow}>
            <View style={styles.depLeft}>
              <Text style={styles.depEmoji}>{emoji}</Text>
              <View style={[styles.routeBadge, dep.mode === 'RAIL' ? styles.routeRail : styles.routeBus]}>
                <Text style={[styles.routeText, dep.mode === 'RAIL' && styles.routeTextRail]}>{dep.route_short}</Text>
              </View>
            </View>
            <View style={styles.depCenter}>
              <Text style={styles.depHeadsign} numberOfLines={1}>→ {dep.headsign}</Text>
            </View>
            <View style={styles.depRight}>
              <Text style={[styles.depTime, minsUntil <= 5 && styles.depTimeSoon]}>{timeLabel}</Text>
              {isLate && <Text style={styles.depDelay}>+{dep.delay_min}min</Text>}
              {dep.realtime && <View style={styles.realtimeDot} />}
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity testID="transit-back" onPress={() => router.back()}>
          <Text style={styles.backText}>← Takaisin</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🚌 Lähiliikenne</Text>
        <Text style={styles.subtitle}>Bussit ja junat lähellä</Text>
      </View>

      <View style={styles.radiusRow}>
        {radiusOptions.map(r => (
          <TouchableOpacity key={r} testID={`radius-${r}`}
            style={[styles.radiusPill, radius === r && styles.radiusPillActive]}
            onPress={() => { setRadius(r); setLoading(true); }}>
            <Text style={[styles.radiusPillText, radius === r && styles.radiusPillTextActive]}>
              {r < 1 ? `${r * 1000}m` : `${r}km`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <View style={styles.errorBanner}><Text style={styles.errorText}>⚠️ {error}</Text></View>
      ) : null}

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#C4632A" /></View>
      ) : (
        <FlatList data={stops} keyExtractor={item => item.gtfs_id} renderItem={renderStop}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStops(); }} tintColor="#C4632A" />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🚏</Text>
              <Text style={styles.emptyText}>Ei pysäkkejä lähellä</Text>
              <Text style={styles.emptyHint}>Kokeile suurempaa hakusädettä</Text>
            </View>
          }
          ListFooterComponent={
            <Text style={styles.footer}>
              {stops.length} pysäkkiä · {gpsLat ? '📍 GPS' : '🏠'} · Digitransit
            </Text>
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
  subtitle: { fontSize: 14, color: '#9ca3af', marginTop: 2 },
  radiusRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  radiusPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5EDE6' },
  radiusPillActive: { backgroundColor: '#C4632A' },
  radiusPillText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  radiusPillTextActive: { color: '#fff' },
  errorBanner: { marginHorizontal: 20, backgroundColor: '#fef3c7', padding: 12, borderRadius: 12, marginBottom: 8 },
  errorText: { fontSize: 14, color: '#92400e', textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  stopCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  stopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  stopNameRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  stopIcon: { fontSize: 20 },
  stopName: { fontSize: 16, fontWeight: '700', color: '#1f2937', flex: 1 },
  distBadge: { backgroundColor: '#FFF5EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#FFD6B8' },
  distText: { fontSize: 12, fontWeight: '700', color: '#C4632A' },
  depRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  depLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 },
  depEmoji: { fontSize: 16 },
  routeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, minWidth: 32, alignItems: 'center' },
  routeBus: { backgroundColor: '#C4632A' },
  routeRail: { backgroundColor: '#7c3aed' },
  routeText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  routeTextRail: { color: '#fff' },
  depCenter: { flex: 1 },
  depHeadsign: { fontSize: 14, color: '#4b5563' },
  depRight: { alignItems: 'flex-end', minWidth: 60 },
  depTime: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  depTimeSoon: { color: '#C4632A' },
  depDelay: { fontSize: 11, color: '#ef4444', fontWeight: '600' },
  realtimeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e', marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#9ca3af', marginTop: 8 },
  emptyHint: { fontSize: 14, color: '#d1d5db', marginTop: 4 },
  footer: { textAlign: 'center', fontSize: 12, color: '#d1d5db', paddingVertical: 16 },
});
