'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Course } from '@/types/course'

const LEVELS = ['Nybegynner', 'Videregående', 'Avansert']
const CATEGORIES = ['Teknologi', 'Økonomi', 'Design', 'Helse', 'Språk', 'Matematikk', 'Vitenskap', 'Historie', 'Kunst', 'Annet']
const COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
  '#475569', '#1c1917',
]

export function EditableCourseInfo({
  draft,
  onChange,
  onDelete,
}: {
  draft: Course
  onChange: (updated: Course) => void
  onDelete: () => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try { await onDelete() } finally { setDeleting(false) }
  }

  function set<K extends keyof Course>(key: K, value: Course[K]) {
    onChange({ ...draft, [key]: value })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-serif text-[22px] mb-7">Kursinformasjon</h2>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wide text-ink-muted mb-2">Tittel</label>
          <input
            value={draft.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg outline-none text-[15px] transition-colors focus:border-accent bg-white"
            placeholder="Kurstittel..."
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wide text-ink-muted mb-2">Beskrivelse</label>
          <textarea
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
            className="w-full px-3 py-3 border border-border rounded-lg outline-none text-[15px] transition-colors focus:border-accent leading-relaxed resize-y bg-white"
            style={{ minHeight: 100 }}
            placeholder="Beskriv kurset..."
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-ink-muted mb-2">Kategori</label>
            <select
              value={draft.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg outline-none text-[15px] transition-colors focus:border-accent bg-white appearance-none"
            >
              <option value="">Velg kategori</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-ink-muted mb-2">Nivå</label>
            <select
              value={draft.level}
              onChange={(e) => set('level', e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg outline-none text-[15px] transition-colors focus:border-accent bg-white appearance-none"
            >
              <option value="">Velg nivå</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wide text-ink-muted mb-3">Forsidefarger</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => set('coverColor', color)}
                className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                style={{
                  background: color,
                  outline: draft.coverColor === color ? `3px solid ${color}` : 'none',
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          {confirming ? (
            <div className="flex items-center gap-3">
              <p className="text-[14px] text-ink flex-1">Er du sikker? Dette kan ikke angres.</p>
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-2 text-[13px] font-medium rounded-lg border border-border hover:bg-bg-warm transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-[13px] font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Sletter...' : 'Ja, slett kurs'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} /> Slett kurs
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
