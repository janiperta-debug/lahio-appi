'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type Place={id:string;name:string;category:string;address:string|null;location_city:string|null;latitude:number;longitude:number;distance_meters:number}
const cats=[['all','🗺️','Kaikki'],['playground','🛝','Leikkipaikat'],['sports','⚽','Liikunta'],['nature','🌲','Luonto'],['swimming','🏊','Uinti'],['pets','🐕','Lemmikit'],['culture','🎨','Kulttuuri']]
const emoji:Record<string,string>={playground:'🛝',sports:'⚽',nature:'🌲',swimming:'🏊',pets:'🐕',culture:'🎨',other:'📍'}

function mapHtml(places:Place[]){
 const markers=places.map(p=>`L.marker([${p.latitude},${p.longitude}]).addTo(map).bindPopup('<b>${String(p.name).replace(/'/g,"\\'")}</b><br>${String(p.address||'').replace(/'/g,"\\'")}');`).join('')
 const center=places[0] ? [places[0].latitude,places[0].longitude] : [60.2055,24.6559]
 return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{height:100%;margin:0} .leaflet-control-attribution{font-size:10px}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\\/script><script>const map=L.map('map').setView([${center[0]},${center[1]}],13);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);${markers}<\\/script></body></html>`
}

export function MapView({places}:{places:Place[]}){
 const [cat,setCat]=useState('all'),[view,setView]=useState<'map'|'list'>('map')
 const filtered=useMemo(()=>cat==='all'?places:places.filter(p=>p.category===cat),[places,cat])
 return <section className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
   <div><p className="text-sm font-semibold text-terracotta">Lähellä</p><h1 className="font-serif text-3xl font-semibold text-lahella-text">Kartta</h1><p className="mt-2 text-sm text-lahella-text2">Lähialueen paikat ja palvelut.</p></div>
   <div className="flex rounded-xl border border-border bg-card p-1"><button onClick={()=>setView('map')} className={`rounded-lg px-3 py-2 text-sm ${view==='map'?'bg-terracotta text-white':''}`}>🗺️ Kartta</button><button onClick={()=>setView('list')} className={`rounded-lg px-3 py-2 text-sm ${view==='list'?'bg-terracotta text-white':''}`}>☷ Lista</button></div>
  </div>
  <div className="mb-4 flex gap-2 overflow-x-auto pb-1">{cats.map(([v,e,l])=><button key={v} onClick={()=>setCat(v)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${cat===v?'bg-terracotta text-white':'bg-white text-lahella-text2 ring-1 ring-border'}`}>{e} {l}</button>)}</div>
  {view==='map'?<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><iframe title="Lähialueen kartta" className="h-[520px] w-full border-0" srcDoc={mapHtml(filtered)} /></div>:
  <div className="grid gap-3 md:grid-cols-2">{filtered.map(p=><div key={p.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex gap-3"><span className="text-2xl">{emoji[p.category]||'📍'}</span><div><h2 className="font-semibold text-lahella-text">{p.name}</h2><p className="mt-1 text-sm text-lahella-text2">{p.address||p.location_city||'Lähialue'}</p><p className="mt-1 text-xs text-lahella-muted">{Math.round(p.distance_meters)} m</p></div></div></div>)}</div>}
  <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"><span className="text-sm text-lahella-text2">{filtered.length} paikkaa lähialueella</span><Link href="/transit" className="rounded-xl bg-terracotta px-4 py-2 text-sm font-semibold text-white">🚌 Lähiliikenne</Link></div>
 </section>
}
