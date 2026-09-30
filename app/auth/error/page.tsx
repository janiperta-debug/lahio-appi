import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-lahella-bg px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <section className="w-full rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-9">
          <p className="text-sm font-semibold text-terracotta">Lähellä</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-lahella-text">
            Vahvistuslinkki ei toiminut
          </h1>
          <p className="mt-3 text-sm leading-6 text-lahella-text2">
            Vahvistuslinkki on voinut vanhentua tai se on jo käytetty. Pyydä tarvittaessa uusi
            vahvistusviesti ja yritä uudelleen.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-terracotta px-5 py-3 font-semibold text-white"
          >
            Takaisin kirjautumiseen
          </Link>
        </section>
      </div>
    </main>
  )
}
