import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapWebView from '../../lib/MapWebView';
import * as Location from 'expo-location';
import { useAuth, apiCall } from '../../lib/auth';
import { useI18n } from '../../lib/i18n';

const MAP_CATS = [
  { key: 'all', emoji: '🗺️', label: 'common.all' },
  { key: 'playground', emoji: '🛝', label: 'map.playgrounds' },
  { key: 'sports', emoji: '⚽', label: 'map.sports' },
  { key: 'nature', emoji: '🌲', label: 'map.nature' },
  { key: 'swimming', emoji: '🏊', label: 'map.swimming' },
  { key: 'pets', emoji: '🐕', label: 'map.pets_places' },
  { key: 'culture', emoji: '🎨', label: 'map.culture_places' },
];

const EMOJI_MAP: Record<string, string> = {
  playground: '🛝', sports: '⚽', nature: '🌲', swimming: '🏊', pets: '🐕', culture: '🎨', other: '📍',
};

function buildMapHtml(places: any[], centerLat: number, centerLon: number) {
  const markersJs = places.map(p => {
    const emoji = EMOJI_MAP[p.category] || '📍';
    const safeName = (p.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const dist = p.distance ? ` (${p.distance})` : '';
    return `addMarker(${p.latitude},${p.longitude},'${emoji}','${safeName}${dist}');`;
  }).join('\n');

  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui}#map{height:100vh;width:100vw}
.emoji-marker{background:none!important;border:none!important}
.emoji-icon{font-size:26px;text-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer}
.home-dot{width:18px;height:18px;background:#C4632A;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #C4632A,0 2px 8px rgba(0,0,0,0.3)}
.leaflet-popup-content{font-family:system-ui;font-size:13px}
.leaflet-popup-content b{color:#C4632A}
</style></head><body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:true}).setView([${centerLat},${centerLon}],14);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'OpenStreetMap',maxZoom:19}).addTo(map);
var homeIcon=L.divIcon({html:'<div class="home-dot"></div>',className:'emoji-marker',iconSize:[18,18],iconAnchor:[9,9]});
L.marker([${centerLat},${centerLon}],{icon:homeIcon}).addTo(map).bindPopup('<b>Sijaintisi</b>');
function addMarker(lat,lon,emoji,name){
var icon=L.divIcon({html:'<div class="emoji-icon">'+emoji+'</div>',className:'emoji-marker',iconSize:[26,26],iconAnchor:[13,13]});
L.marker([lat,lon],{icon:icon}).addTo(map).bindPopup('<b>'+emoji+' '+name+'</b>');
}
${markersJs}
<\/script></body></html>`;
}

export default function MapTab() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [gpsLocation, setGpsLocation] = useState<{lat: number; lon: number} | null>(null);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setGpsError('Sijainnin käyttöoikeus evätty');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setGpsLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      } catch {
        // GPS not available (web preview etc.)
      }
    })();
  }, []);

  const currentLat = gpsLocation?.lat || 60.6312;
  const currentLon = gpsLocation?.lon || 24.8614;
  const hasGps = !!gpsLocation;

  const fetchCachedPlaces = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (hasGps) {
        params.set('lat', String(currentLat));
        params.set('lon', String(currentLon));
        params.set('radius_km', '10');
      }
      const data = await apiCall(`/api/map-places?${params.toString()}`);
      setPlaces(data.places || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [category, currentLat, currentLon, hasGps]);

  const fetchFromOSM = useCallback(async () => {
    setFetching(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      params.set('lat', String(currentLat));
      params.set('lon', String(currentLon));
      params.set('radius_km', '10');
      await apiCall(`/api/map-places/fetch-osm?${params.toString()}`);
      await fetchCachedPlaces();
    } catch (e) { console.error('OSM fetch error:', e); }
    setFetching(false);
  }, [category, currentLat, currentLon, fetchCachedPlaces]);

  useEffect(() => { setLoading(true); fetchCachedPlaces(); }, [fetchCachedPlaces]);

  useEffect(() => {
    if (!loading && places.length === 0) fetchFromOSM();
  }, [loading, places.length]);

  const mapHtml = useMemo(() => buildMapHtml(places, currentLat, currentLon), [places, currentLat, currentLon]);

  const renderPlaceItem = ({ item }: { item: any }) => (
    <View testID={`place-${item.id || item.osm_id}`} style={styles.placeCard}>
      <Text style={styles.placeEmoji}>{EMOJI_MAP[item.category] || '📍'}</Text>
      <View style={styles.placeInfo}>
        <Text style={styles.placeName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.placeAddress} numberOfLines={1}>
          {item.distance ? `${item.distance} · ` : ''}{item.address || item.city || ''}
        </Text>
      </View>
      <View style={styles.placeCatBadge}>
        <Text style={styles.placeCatText}>{MAP_CATS.find(c => c.key === item.category)?.emoji || '📍'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <FlatList horizontal data={MAP_CATS} keyExtractor={c => c.key} showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catContent}
          renderItem={({ item: c }) => (
            <TouchableOpacity key={c.key} testID={`map-cat-${c.key}`}
              style={[styles.catChip, category === c.key && styles.catChipActive]}
              onPress={() => setCategory(c.key)}>
              <Text style={[styles.catText, category === c.key && styles.catTextActive]}>{c.emoji}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.viewToggle}>
          <TouchableOpacity testID="view-map" style={[styles.viewBtn, view === 'map' && styles.viewBtnActive]} onPress={() => setView('map')}>
            <Text style={styles.viewBtnText}>🗺️</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="view-list" style={[styles.viewBtn, view === 'list' && styles.viewBtnActive]} onPress={() => setView('list')}>
            <Text style={styles.viewBtnText}>📋</Text>
          </TouchableOpacity>
        </View>
      </View>

      {gpsError ? (
        <View style={styles.gpsBanner}>
          <Text style={styles.gpsBannerText}>📍 {gpsError}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#C4632A" /></View>
      ) : view === 'map' && MapWebView ? (
        <MapWebView
          testID="map-webview"
          source={{ html: mapHtml }}
          style={styles.map}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
        />
      ) : (
        <FlatList data={places} keyExtractor={(item, i) => item.id || String(item.osm_id) || String(i)}
          renderItem={renderPlaceItem} contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyEmoji}>🗺️</Text>
              <Text style={styles.emptyText}>Ei paikkoja vielä</Text>
              <TouchableOpacity testID="fetch-osm-empty" style={styles.fetchBtn} onPress={fetchFromOSM}>
                <Text style={styles.fetchBtnText}>Hae paikat OpenStreetMapista</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <View style={styles.bottomBar}>
        <Text style={styles.countText}>
          {hasGps ? '📍 GPS' : '🏠'} · {places.length} {t('map.places_nearby')}
        </Text>
        <TouchableOpacity testID="transit-btn" style={styles.transitBtn} onPress={() => router.push('/transit')}>
          <Text style={styles.transitText}>🚌 Lähiliikenne</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="refresh-osm" style={styles.refreshBtn} onPress={fetchFromOSM} disabled={fetching}>
          {fetching ? <ActivityIndicator size="small" color="#C4632A" /> : <Text style={styles.refreshText}>🔄</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBF6F1' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  catContent: { paddingHorizontal: 8, gap: 6, alignItems: 'center' },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5EDE6' },
  catChipActive: { backgroundColor: '#C4632A' },
  catText: { fontSize: 18 },
  catTextActive: { fontSize: 18 },
  viewToggle: { flexDirection: 'row', marginRight: 8, gap: 4 },
  viewBtn: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, backgroundColor: '#F5EDE6' },
  viewBtnActive: { backgroundColor: '#C4632A' },
  viewBtnText: { fontSize: 16 },
  gpsBanner: { backgroundColor: '#fef3c7', paddingHorizontal: 16, paddingVertical: 8 },
  gpsBannerText: { fontSize: 13, color: '#92400e', textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 8, paddingBottom: 20 },
  placeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  placeEmoji: { fontSize: 28 },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  placeAddress: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  placeCatBadge: { backgroundColor: '#FFF5EE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  placeCatText: { fontSize: 16 },
  emptyList: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#9ca3af' },
  fetchBtn: { backgroundColor: '#C4632A', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
  fetchBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  countText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  transitBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#C4632A' },
  transitText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#FFF5EE', borderWidth: 1, borderColor: '#FFD6B8' },
  refreshText: { fontSize: 13, fontWeight: '600', color: '#C4632A' },
});
