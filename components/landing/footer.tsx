import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-lahella-text text-primary-foreground/50 py-8 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/lahella_logo.png"
          alt="Lähellä logo"
          width={28}
          height={28}
          className="rounded-full"
        />
        <span className="font-serif font-semibold text-primary-foreground text-base">
          {"Lähellä"}
        </span>
      </Link>
      <p className="text-sm">{"© 2025 Janope. Kaikki oikeudet pidätetään."}</p>
      <div className="flex gap-6">
        <Link href="#" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
          {"Tietosuoja"}
        </Link>
        <Link href="#" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
          {"Käyttöehdot"}
        </Link>
        <Link href="#" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
          {"Ota yhteyttä"}
        </Link>
      </div>
    </footer>
  )
}
