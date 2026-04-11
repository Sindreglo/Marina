const STATS = [
  { value: '1 200+', label: 'Kurs' },
  { value: '15 000+', label: 'Studenter' },
  { value: '340+', label: 'Lærere' },
  { value: '4,8', label: 'Snittrating' },
]

export function StatsRow() {
  return (
    <div className="flex justify-center gap-10 flex-wrap py-12 animate-fade-up [animation-delay:120ms]">
      {STATS.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-2xl font-serif">{s.value}</div>
          <div className="text-[13px] text-ink-muted mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
