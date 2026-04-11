import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaBanner() {
  return (
    <div className="bg-ink rounded-2xl p-10 text-center text-white relative overflow-hidden animate-fade-up [animation-delay:350ms]">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent opacity-15" />
      <h2 className="font-serif text-[26px] mb-2.5 relative">Del din kunnskap med verden</h2>
      <p className="text-white/60 text-[15px] leading-relaxed max-w-sm mx-auto mb-6">
        Lag engasjerende kurs med tekst, bilder og video. Nå tusenvis av motiverte studenter.
      </p>
      <Link
        href="/kurs/ny/rediger"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white rounded-xl text-[15px] font-semibold relative hover:bg-accent-hover transition-colors"
      >
        Kom i gang som lærer <ArrowRight size={16} />
      </Link>
    </div>
  )
}
