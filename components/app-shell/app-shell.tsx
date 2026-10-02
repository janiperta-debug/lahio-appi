import Link from "next/link"
import { Bell, CalendarDays, UserRound, Users } from "lucide-react"

const navItems = [
  { href: "/", label: "Naapurit", icon: Users },
  { href: "/events", label: "Tapahtumat", icon: CalendarDays },
  { href: "/profile", label: "Profiili", icon: UserRound },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <header className="h-16 shrink-0 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-semibold text-terracotta">Lähellä</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Ilmoitukset"
            className="relative size-9 rounded-lg border border-border bg-lahella-surface2 flex items-center justify-center text-lahella-text2 hover:text-terracotta transition-colors"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-terracotta" />
          </button>
          <Link
            href="/profile"
            aria-label="Profiili"
            className="size-9 rounded-full bg-terracotta-faint border border-border flex items-center justify-center text-sm"
          >
            👤
          </Link>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="hidden lg:flex w-60 shrink-0 border-r border-border bg-card p-4 flex-col">
          <nav className="space-y-1" aria-label="Päänavigaatio">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-lahella-text2 hover:bg-terracotta-faint hover:text-terracotta transition-colors"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
      </div>

      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur border-t border-border flex pb-[env(safe-area-inset-bottom)]"
        aria-label="Päänavigaatio"
      >
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[0.62rem] font-semibold text-lahella-muted hover:text-terracotta"
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
