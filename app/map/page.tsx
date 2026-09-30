export default function MapPage() {
  return (
    <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-terracotta">Lähellä</p>
        <h1 className="font-serif text-3xl font-semibold text-lahella-text">Kartta</h1>
        <p className="mt-2 text-sm text-lahella-text2">Lähialueen paikat ja palvelut.</p>
      </div>
      <div className="min-h-[420px] rounded-2xl border border-border bg-card flex items-center justify-center">
        <p className="text-sm text-lahella-muted">Karttanäkymä liitetään tähän vanhan Lähellä-sovelluksen toimintojen pohjalta.</p>
      </div>
    </section>
  )
}
