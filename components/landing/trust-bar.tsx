const trustItems = [
  { icon: "✅", label: "Vain todennetut käyttäjät" },
  { icon: "🔒", label: "Yksityisyytesi suojattu" },
  { icon: "📍", label: "Vain lähialueesi" },
  { icon: "💚", label: "Täysin ilmainen" },
  { icon: "🇫🇮", label: "Tehty Suomessa" },
]

export function TrustBar() {
  return (
    <div className="bg-sand border-y border-sand2 py-5 px-6 lg:px-12 flex justify-center gap-6 lg:gap-16 flex-wrap">
      {trustItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm font-semibold text-lahella-text2">
          <span className="text-base">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  )
}
