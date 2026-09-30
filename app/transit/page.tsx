import Link from 'next/link'
import {redirect} from 'next/navigation'
import {AppShell} from '@/components/app-shell/app-shell'
import {TransitView} from '@/components/transit/transit-view'
import {createClient} from '@/lib/supabase/server'
export default async function TransitPage(){
 const supabase=await createClient()
 const {data}=await supabase.auth.getClaims()
 if(!data?.claims?.sub)redirect('/login')
 return <AppShell><div className="mx-auto w-full max-w-5xl px-4 pt-4 sm:px-6 lg:px-8"><Link href="/map" className="text-sm font-semibold text-terracotta">← Takaisin kartalle</Link></div><TransitView/></AppShell>
}