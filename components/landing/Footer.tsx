import { Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-bg-warm border-t border-border mt-12">
      <div className="max-w-5xl mx-auto px-5 md:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-serif text-lg mb-1">Marina Bambulyak</p>
          <p className="text-[13px] text-ink-muted">Matematikklærer</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <a
            href="mailto:marina.bambulyak@gmail.com"
            className="flex items-center gap-2 text-[14px] text-ink-muted hover:text-ink transition-colors"
          >
            <Mail size={14} /> marina.bambulyak@gmail.com
          </a>
          <a
            href="tel:+4790887095"
            className="flex items-center gap-2 text-[14px] text-ink-muted hover:text-ink transition-colors"
          >
            <Phone size={14} /> 908 87 095
          </a>
        </div>
      </div>
    </footer>
  )
}
