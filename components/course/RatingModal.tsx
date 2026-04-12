'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'

interface Props {
  courseId: string
  userId: string
  onClose: () => void
}

export function RatingModal({ courseId, userId, onClose }: Props) {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    if (!selected) return
    setSubmitting(true)
    await fetch('/api/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, userId, rating: selected }),
    })
    setDone(true)
    setSubmitting(false)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-bg-card rounded-2xl shadow-xl p-8 w-full max-w-sm text-center animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors"
        >
          <X size={18} />
        </button>

        {done ? (
          <div className="py-4">
            <p className="font-serif text-xl mb-2">Takk for tilbakemeldingen!</p>
            <p className="text-[14px] text-ink-muted">Din vurdering er registrert.</p>
          </div>
        ) : (
          <>
            <p className="font-serif text-xl mb-2">Kurset er fullført!</p>
            <p className="text-[14px] text-ink-muted mb-6">Hva synes du om kurset?</p>

            <div className="flex justify-center gap-2 mb-7">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelected(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={34}
                    className={`transition-colors ${
                      star <= (hovered || selected)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-border'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-medium text-ink-muted border border-border hover:border-border-focus transition-colors"
              >
                Hopp over
              </button>
              <button
                onClick={submit}
                disabled={!selected || submitting}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40"
              >
                {submitting ? 'Sender...' : 'Send inn'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
