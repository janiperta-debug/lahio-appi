import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"

export function Topbar() {
  return (
    <div className="col-span-full bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          href="/landing"
          className="flex items-center gap-1.5 text-sm font-medium text-lahella-text2 hover:text-terracotta transition-colors bg-lahella-surface2 border border-border rounded-lg px-2.5 py-1.5"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">{"Takaisin"}</span>
        </Link>
        <Link href="/landing" className="flex items-center gap-2">
          <Image
            src="/images/lahella_logo.png"
            alt="Lähellä logo"
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="font-serif font-semibold text-lg text-terracotta tracking-tight">
            {"Lähellä"}
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg bg-lahella-surface2 border border-border flex items-center justify-center relative" aria-label="Ilmoitukset">
          <Bell size={16} className="text-lahella-text2" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-terracotta" />
        </button>
        <div className="flex items-center gap-2 bg-lahella-surface2 border border-border rounded-full pl-1 pr-3 py-1 text-sm font-semibold text-lahella-text">
          <div className="w-6 h-6 rounded-full bg-terracotta-faint flex items-center justify-center text-xs">
            {"👩"}
          </div>
          {"Tiina"}
        </div>
      </div>
    </div>
  )
}
