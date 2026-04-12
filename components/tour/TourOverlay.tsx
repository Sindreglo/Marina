'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

export interface TourStep {
  selector: string
  title: string
  description: string
}

interface Props {
  steps: TourStep[]
  stepIndex: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}

const PAD = 8
const OVERLAY = 'rgba(0,0,0,0.6)'
const CALLOUT_W = 264

export function TourOverlay({ steps, stepIndex, onNext, onPrev, onClose }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const step = steps[stepIndex]

  const measure = useCallback(() => {
    const el = document.querySelector(step.selector)
    if (!el) { setRect(null); return }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setTimeout(() => setRect(el.getBoundingClientRect()), 350)
  }, [step.selector])

  useEffect(() => {
    setRect(null)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && stepIndex < steps.length - 1) onNext()
      if (e.key === 'ArrowLeft' && stepIndex > 0) onPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNext, onPrev, stepIndex, steps.length])

  const hTop = rect ? rect.top - PAD : 0
  const hLeft = rect ? rect.left - PAD : 0
  const hWidth = rect ? rect.width + PAD * 2 : 0
  const hHeight = rect ? rect.height + PAD * 2 : 0
  const hRight = hLeft + hWidth
  const hBottom = hTop + hHeight

  const vw = window.innerWidth
  const vh = window.innerHeight

  const showRight = rect && hRight + 12 + CALLOUT_W + 8 < vw
  const calloutStyle: React.CSSProperties = !rect
    ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: CALLOUT_W }
    : showRight
    ? {
        top: Math.min(Math.max(hTop, 8), vh - 220),
        left: hRight + 12,
        width: CALLOUT_W,
      }
    : {
        bottom: vh - hTop + 12,
        left: Math.max(8, Math.min(hLeft, vw - CALLOUT_W - 8)),
        width: Math.min(CALLOUT_W, vw - 16),
      }

  const callout = (
    <div className="fixed z-[70] bg-bg-card rounded-2xl shadow-2xl border border-border p-5" style={calloutStyle}>
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <p className="text-[11px] font-semibold text-accent uppercase tracking-wide mb-0.5">
            {stepIndex + 1} / {steps.length}
          </p>
          <p className="text-[15px] font-semibold leading-snug">{step.title}</p>
        </div>
        <button onClick={onClose} className="ml-3 shrink-0 mt-0.5 p-0.5 text-ink-muted hover:text-ink transition-colors">
          <X size={15} />
        </button>
      </div>
      <p className="text-[13px] text-ink-muted leading-relaxed mb-4">{step.description}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="flex items-center gap-1 text-[13px] text-ink-muted hover:text-ink transition-colors disabled:opacity-0"
        >
          <ChevronLeft size={14} /> Forrige
        </button>
        {stepIndex < steps.length - 1 ? (
          <button
            onClick={onNext}
            className="flex items-center gap-1 text-[13px] font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            Neste <ChevronRight size={14} />
          </button>
        ) : (
          <button onClick={onClose} className="text-[13px] font-semibold text-accent hover:text-accent/80 transition-colors">
            Ferdig
          </button>
        )}
      </div>
    </div>
  )

  if (!rect) return callout

  return (
    <>
      {/* Top */}
      <div className="fixed inset-x-0 top-0 z-[60] pointer-events-none" style={{ height: hTop, background: OVERLAY }} />
      {/* Bottom */}
      <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none" style={{ top: hBottom, background: OVERLAY }} />
      {/* Left */}
      <div className="fixed z-[60] pointer-events-none" style={{ top: hTop, height: hHeight, left: 0, width: hLeft, background: OVERLAY }} />
      {/* Right */}
      <div className="fixed z-[60] pointer-events-none" style={{ top: hTop, height: hHeight, left: hRight, right: 0, background: OVERLAY }} />
      {/* Highlight ring */}
      <div
        className="fixed z-[61] pointer-events-none rounded-lg border-2 border-accent"
        style={{ top: hTop, left: hLeft, width: hWidth, height: hHeight }}
      />
      {callout}
    </>
  )
}
