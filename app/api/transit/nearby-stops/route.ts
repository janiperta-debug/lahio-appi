import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const URL = 'https://api.digitransit.fi/routing/v2/finland/gtfs/v1'

function distance(a:number,b:number,c:number,d:number) {
  const R=6371000,p1=a*Math.PI/180,p2=c*Math.PI/180,dp=(c-a)*Math.PI/180,dl=(d-b)*Math.PI/180
  const x=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))
}
function label(m:number) { return m<1000 ? `${Math.max(50,Math.round(m/50)*50)} m` : `${(m/1000).toFixed(1)} km` }

export async function GET(req:NextRequest) {
  const supabase=await createClient()
  const {data}=await supabase.auth.getClaims()
  if(!data?.claims?.sub) return NextResponse.json({error:'Kirjautuminen vaaditaan.'},{status:401})
  const key=process.env.DIGITRANSIT_API_KEY
  if(!key) return NextResponse.json({error:'Digitransit ei ole vielä konfiguroitu.'},{status:503})
  const radius=Math.min(5,Math.max(.3,Number(req.nextUrl.searchParams.get('radius_km')??.5)))
  const {data:coords}=await supabase.rpc('get_my_location_coordinates')
  if(!coords?.[0]) return NextResponse.json({error:'Aseta ensin sijaintisi profiilissa.'},{status:400})
  const lat=Number(coords[0].latitude),lon=Number(coords[0].longitude),off=radius*.009
  const query={query:`{stopsByBbox(minLat:${lat-off},minLon:${lon-off},maxLat:${lat+off},maxLon:${lon+off}){gtfsId name lat lon stoptimesWithoutPatterns(numberOfDepartures:5){scheduledDeparture realtimeDeparture realtime serviceDay headsign trip{route{shortName longName mode}}}}}`}
  try {
    const res=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','digitransit-subscription-key':key},body:JSON.stringify(query),cache:'no-store'})
    const body=await res.text()
    if(!res.ok){
      return NextResponse.json({error:'Digitransit hylkäsi pyynnön.',details:`HTTP ${res.status}`},{status:502})
    }
    let json:any
    try{json=JSON.parse(body)}catch{
      return NextResponse.json({error:'Digitransit palautti virheellisen vastauksen.'},{status:502})
    }
    if(json.errors?.length){
      console.error('Digitransit GraphQL error',json.errors)
      const message=String(json.errors[0]?.message??'Tuntematon GraphQL-virhe')
      return NextResponse.json({error:'Digitransit-haku epäonnistui.',details:message},{status:502})
    }
    const stops=(json.data?.stopsByBbox??[]).map((s:any)=>{
      const ds=(s.stoptimesWithoutPatterns??[]).map((d:any)=>{const r=d.trip?.route??{},sch=Number(d.scheduledDeparture??0),real=Number(d.realtimeDeparture??sch);return {time:`${String(Math.floor(real/3600)%24).padStart(2,'0')}:${String(Math.floor(real%3600/60)).padStart(2,'0')}`,departure_ts:Number(d.serviceDay??0)+real,realtime:Boolean(d.realtime),delay_min:d.realtime?Math.round((real-sch)/60):0,headsign:d.headsign??'',route_short:r.shortName??'',route_long:r.longName??'',mode:r.mode??'BUS'}})
      const dm=distance(lat,lon,Number(s.lat),Number(s.lon))
      return {gtfs_id:s.gtfsId,name:s.name,distance:label(dm),distance_m:dm,departures:ds}
    }).filter((s:any)=>s.departures.length&&s.distance_m<=radius*1000).sort((a:any,b:any)=>a.distance_m-b.distance_m).slice(0,30)
    return NextResponse.json({stops})
  } catch { return NextResponse.json({error:'Lähiliikennepalvelu ei vastannut.'},{status:502}) }
}