'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const categories=[['lapsille','Lapsille'],['liikunta','Liikunta'],['kulttuuri','Kulttuuri'],['kokoontuminen','Kokoontuminen']]

export function EventForm() {
  const router=useRouter(), supabase=createClient()
  const [error,setError]=useState(''), [loading,setLoading]=useState(false)
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const form=new FormData(event.currentTarget)
    const title=String(form.get('title')||'').trim(), description=String(form.get('description')||'').trim()
    const category=String(form.get('category')||''), address=String(form.get('address')||'').trim()
    const startsAt=String(form.get('starts_at')||''), max=Number(form.get('max_participants')||0)
    if(!title||!startsAt){setError('Täytä vähintään nimi ja ajankohta.');setLoading(false);return}
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){setError('Kirjautuminen tarvitaan.');setLoading(false);return}
    const {data:profile}=await supabase.from('profiles').select('location_point,location_city').eq('id',user.id).maybeSingle()
    const {error}=await supabase.from('events').insert({user_id:user.id,title,description:description||null,category,location_address:address||null,location_city:profile?.location_city||null,location_point:profile?.location_point||null,starts_at:new Date(startsAt).toISOString(),max_participants:max>0?max:null})
    if(error){setError(error.message);setLoading(false);return}
    router.push('/events'); router.refresh()
  }
  return <section className="mx-auto w-full max-w-2xl p-4 sm:p-6 lg:p-8">
    <h1 className="font-serif text-3xl font-semibold text-lahella-text">Luo tapahtuma</h1>
    <p className="mt-2 text-sm text-lahella-text2">Järjestä jotain lähialueellesi.</p>
    <form onSubmit={submit} className="mt-7 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Nimi</span><input name="title" required className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta" placeholder="Esim. Lauantain puistojumppa"/></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Kuvaus</span><textarea name="description" rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"/></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Kategoria</span><select name="category" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta">{categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Paikka / osoite</span><input name="address" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta" placeholder="Esim. Urheilupuisto"/></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Ajankohta</span><input name="starts_at" required type="datetime-local" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"/></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Osallistujia enintään</span><input name="max_participants" type="number" min="1" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"/></label>
      {error&&<p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-terracotta px-4 py-3 font-semibold text-white disabled:opacity-60">{loading?'Tallennetaan…':'Luo tapahtuma'}</button>
    </form>
  </section>
}