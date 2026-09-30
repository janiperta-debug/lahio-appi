import Link from "next/link"

export default function EventsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-terracotta">Lähellä</p>
        <h1 className="font-serif text-3xl font-semibold text-lahella-text">Tapahtumat</h1>
        <p className="mt-2 text-sm text-lahella-text2">Tapahtumat lähialueeltasi.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-lahella-text2">Tapahtumadata liitetään tähän näkymään vanhan Lähellä-sovelluksen mukaisesti seuraavassa vaiheessa.</p>
        <Link href="/" className="mt-4 inline-flex text-sm font-semibold text-terracotta">← Naapurit</Link>
      </div>
    </section>
  )
}
