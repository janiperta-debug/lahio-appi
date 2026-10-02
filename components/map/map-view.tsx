import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Place={id:string;name:string;category:string;address:string|null;location_city:string|null;latitude:number;longitude:number;distance_meters:number}
type Center={latitude:number;longitude:number}
const cats=[['all','🗺️','Kaikki'],['playground','🛝','Leikkipaikat'],['sports','⚽','Liikunta'],['nature','🌲','Luonto'],['swimming','🏊','Uinti'],['pets','🐕','Lemmikit'],['culture','🎨','Kulttuuri']]
const emoji:Record<string,string>={playground:'🛝',sports:'⚽',nature:'🌲',swimming:'🏊',pets:'🐕',culture:'🎨',other:'📍'}

function popupText(value:string){return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/"/g,'&quot;')}

function mapHtml(places:Place[], center:Center|null){
 const fallback={latitude:center?.latitude??60.2055,longitude:center?.longitude??24.6559}
 const markers=places.map(p=>{
   const icon=emoji[p.category]||'📍'
   return [
     "L.marker([",String(p.latitude),",",String(p.longitude),"],{icon:L.divIcon({className:'lahella-marker',html:'<span>",
     icon,
     "</span>',iconSize:[42,42],iconAnchor:[21,21],popupAnchor:[0,-20]})}).addTo(map).bindPopup('<b>",
     popupText(p.name),
     "</b><br>",
     popupText(p.address||p.location_city||''),
     "');"
   ].join('')
 }).join('')
 const userMarker=center
   ? [
       "L.circleMarker([",String(center.latitude),",",String(center.longitude),
       "],{radius:8,color:'#e8734a',fillColor:'#e8734a',fillOpacity:.9}).addTo(map).bindPopup('<b>Oma sijaintisi</b>');"
     ].join('')
   : ''
 const htmlParts=[
   '<!doctype html><html><head>',
   '<meta name="viewport" content="width=device-width,initial-scale=1">',
   '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">',
   '<style>html,body,#map{height:100%;margin:0}.leaflet-control-attribution{font-size:10px}.lahella-marker{display:flex;align-items:center;justify-content:center;width:42px!important;height:42px!important;background:white;border:2px solid #e8734a;border-radius:50%;box-shadow:0 2px 8px rgba(45,36,25,.2);font-size:23px}</style>',
   '</head><body><div id="map"></div>',
   '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>',
   '<script>const map=L.map("map").setView(['+String(fallback.latitude)+','+String(fallback.longitude)+'],14);',
   'L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(map);',
   userMarker,
   markers,
   '</'+'script></body></html>'
 ]
 return htmlParts.join('')
}

export function MapView({places:initialPlaces,initialCenter}:{places:Place[];initialCenter:Center|null}){
 const [cat,setCat]=useState('all'),[view,setView]=useState<'map'|'list'>('map')
 const [places,setPlaces]=useState<Place[]>(initialPlaces)
 const [center,setCenter]=useState<Center|null>(initialCenter)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const supabase=useMemo(()=>createClient(),[])
 const mapRequestInFlight=useRef(false)

 useEffect(()=>{
   let cancelled=false
   let lastFetched:Center|null=null

   const loadAt=async(lat:number,lon:number)=>{
     if(cancelled || mapRequestInFlight.current)return
     mapRequestInFlight.current=true
     setLoading(true)
     setError('')
     try{
       const params=new URLSearchParams({
         lat:String(lat),
         lon:String(lon),
         radius_km:'10',
         category:cat,
       })
       const response=await fetch(`/api/map-places?${params.toString()}`,{
         method:'GET',
         cache:'no-store',
       })
       const data=await response.json().catch(()=>null)
       if(!response.ok) throw new Error(data?.error||'Karttapaikkojen haku epäonnistui.')
       if(cancelled)return
       setPlaces(data?.places??[])
       setCenter(data?.center??{latitude:lat,longitude:lon})
       lastFetched={latitude:lat,longitude:lon}
     }catch(e){
       if(!cancelled)setError(e instanceof Error?e.message:'Karttapaikkojen haku epäonnistui.')
     }finally{
       mapRequestInFlight.current=false
       if(!cancelled)setLoading(false)
     }
   }

   const distanceKm=(a:Center,b:Center)=>{
     const dLat=(b.latitude-a.latitude)*Math.PI/180
     const dLon=(b.longitude-a.longitude)*Math.PI/180
     const x=Math.sin(dLat/2)**2+Math.cos(a.latitude*Math.PI/180)*Math.cos(b.latitude*Math.PI/180)*Math.sin(dLon/2)**2
     return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))
   }

   if(!navigator.geolocation){
     if(initialCenter) void loadAt(initialCenter.latitude,initialCenter.longitude)
     else setLoading(false)
     return
   }

   const watchId=navigator.geolocation.watchPosition(
     position=>{
       const next={latitude:position.coords.latitude,longitude:position.coords.longitude}
       if(!lastFetched || distanceKm(lastFetched,next)>=2){
         void loadAt(next.latitude,next.longitude)
       }
     },
     ()=>{
       if(initialCenter) void loadAt(initialCenter.latitude,initialCenter.longitude)
       else if(!cancelled)setLoading(false)
     },
     {enableHighAccuracy:true,maximumAge:60000,timeout:10000}
   )

   return()=>{
     cancelled=true
     navigator.geolocation.clearWatch(watchId)
   }
 },[cat,initialCenter,supabase])

 const filtered=useMemo(()=>cat==='all'?places:places.filter(p=>p.category===cat),[places,cat])

 return <section className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
   <div><p className="text-sm font-semibold text-terracotta">Lähellä</p><h1 className="font-serif text-3xl font-semibold text-lahella-text">Kartta</h1><p className="mt-2 text-sm text-lahella-text2">Paikat ja palvelut siellä missä olet.</p></div>
   <div className="flex rounded-xl border border-border bg-card p-1"><button onClick={()=>setView('map')} className={`rounded-lg px-3 py-2 text-sm ${view==='map'?'bg-terracotta text-white':''}`}>🗺️ Kartta</button><button onClick={()=>setView('list')} className={`rounded-lg px-3 py-2 text-sm ${view==='list'?'bg-terracotta text-white':''}`}>☷ Lista</button></div>
  </div>
  <div className="mb-4 flex gap-2 overflow-x-auto pb-1">{cats.map(([v,e,l])=><button key={v} onClick={()=>setCat(v)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${cat===v?'bg-terracotta text-white':'bg-white text-lahella-text2 ring-1 ring-border'}`}>{e} {l}</button>)}</div>
  {error&&<div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}
  {view==='map'?<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><iframe title="Lähialueen kartta" className="h-[520px] w-full border-0" srcDoc={mapHtml(filtered,center)} /></div>:
  <div className="grid gap-3 md:grid-cols-2">{filtered.map(p=><div key={p.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex gap-3"><span className="text-2xl">{emoji[p.category]||'📍'}</span><div><h2 className="font-semibold text-lahella-text">{p.name}</h2><p className="mt-1 text-sm text-lahella-text2">{p.address||p.location_city||'Lähialue'}</p><p className="mt-1 text-xs text-lahella-muted">{Math.round(p.distance_meters)} m</p></div></div></div>)}</div>}
  <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"><span className="text-sm text-lahella-text2">{loading?'Haetaan paikkoja…':`${filtered.length} paikkaa lähialueella`}</span><Link href="/transit" className="rounded-xl bg-terracotta px-4 py-2 text-sm font-semibold text-white">🚌 Lähiliikenne</Link></div>
 </div>
 </section>
}
