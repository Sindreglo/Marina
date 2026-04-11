import { Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-16 text-center relative overflow-hidden">
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)",
        }}
      />
      <div className="relative animate-fade-up">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent-soft rounded-full text-[13px] font-semibold text-accent mb-5">
          <Zap size={14} /> Norges læringsplattform
        </div>
        <h1 className="font-serif text-[44px] leading-[1.15] tracking-tight max-w-lg mx-auto mb-4">
          Kunnskap som
          <br />
          inspirerer
        </h1>
        <p className="text-[17px] leading-relaxed text-ink-muted max-w-md mx-auto">
          Oppdag kurs laget av engasjerte lærere. Lær i ditt eget tempo, når og
          hvor det passer deg.
        </p>
      </div>
    </section>
  );
}
