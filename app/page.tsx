import { AppShell } from "@/components/app-shell/app-shell"

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-terracotta">Lähellä</p>
          <h1 className="font-serif text-3xl font-semibold text-lahella-text">Naapurit</h1>
          <p className="mt-2 text-sm text-lahella-text2">Ihmiset, leikkikaverit, harrastukset ja naapuriapu lähialueeltasi.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold text-lahella-text">Leikkikaverit</h2>
            <p className="mt-2 text-sm text-lahella-text2">Löydä lapsille seuraa läheltä.</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold text-lahella-text">Harrastukset</h2>
            <p className="mt-2 text-sm text-lahella-text2">Tutustu lähialueen harrastajiin.</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold text-lahella-text">Naapuriapu</h2>
            <p className="mt-2 text-sm text-lahella-text2">Apua ja apua tarvitsevia lähistöllä.</p>
          </article>
        </div>
      </section>
    </AppShell>
  )
}
