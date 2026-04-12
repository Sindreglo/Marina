const STATS = [
  { value: '10+', label: 'År med erfaring' },
  { value: 'Alle nivåer', label: 'Grunnskole til universitet' },
  { value: 'Norsk', label: 'Læreplan' },
]

export function HeroSection() {
  return (
    <section className="pt-16 pb-4 text-center relative overflow-hidden">
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)",
        }}
      />
      <div className="relative animate-fade-up">
        <p className="text-[13px] font-semibold text-accent mb-3">Marina Bambulyak</p>
        <h1 className="font-serif text-[44px] leading-[1.15] tracking-tight max-w-lg mx-auto mb-4">
          Matematikk
          <br />
          gjort forståelig
        </h1>
        <p className="text-[17px] leading-relaxed text-ink-muted max-w-md mx-auto">
          Matematikk forklart trinn for trinn — fra grunnskole til universitetet.
          Lær i ditt eget tempo.
        </p>
        <div className="flex justify-center gap-10 flex-wrap pt-10 pb-2">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-serif">{s.value}</div>
              <div className="text-[13px] text-ink-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
