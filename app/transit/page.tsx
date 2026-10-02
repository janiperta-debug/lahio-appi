import {redirect} from 'next/navigation'
import {AppShell} from '@/components/app-shell/app-shell'
import {TransitView} from '@/components/transit/transit-view'
import {createClient} from '@/lib/supabase/server'
export default async function TransitPage(){
 const supabase=await createClient()
 const {data}=await supabase.auth.getClaims()
 if(!data?.claims?.sub)redirect('/login')
 return <AppShell><TransitView/></AppShell>
}