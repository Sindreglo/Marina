import Link from 'next/link'
import { Zap, ArrowRight, PenLine } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="pt-16 pb-12 text-center relative overflow-hidden">
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)' }}
      />
      <div className="relative animate-fade-up">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent-soft rounded-full text-[13px] font-semibold text-accent mb-5">
          <Zap size={14} /> Norges læringsplattform
        </div>
        <h1 className="font-serif text-[44px] leading-[1.15] tracking-tight max-w-lg mx-auto mb-4">
          Kunnskap som<br />inspirerer
        </h1>
        <p className="text-[17px] leading-relaxed text-ink-muted max-w-md mx-auto mb-7">
          Oppdag kurs laget av engasjerte lærere. Lær i ditt eget tempo, når og hvor det passer deg.
        </p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          <a
            href="#kurs"
            className="flex items-center gap-2 px-7 py-3.5 bg-accent text-white rounded-xl text-[15px] font-semibold shadow-[0_2px_12px_rgba(232,85,61,0.3)] hover:bg-accent-hover hover:-translate-y-px transition-all duration-200"
          >
            Utforsk kurs <ArrowRight size={16} />
          </a>
          <Link
            href="/kurs/ny/rediger"
            className="flex items-center gap-2 px-7 py-3.5 bg-bg-card text-ink border border-border rounded-xl text-[15px] font-semibold hover:border-ink hover:-translate-y-px transition-all duration-200"
          >
            <PenLine size={16} /> Lag et kurs
          </Link>
        </div>
      </div>
    </section>
  )
}
