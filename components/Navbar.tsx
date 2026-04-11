'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, PenLine } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const match = pathname.match(/^\/kurs\/([^/]+)/)
  const courseId = match?.[1] ?? null
  const isEditor = pathname.endsWith('/rediger')

  return (
    <nav className="sticky top-0 z-50 border-b border-border" style={{ background: 'rgba(250,249,247,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-8">
        <Link href="/" className="font-serif text-xl tracking-tight flex items-center gap-2 shrink-0">
          <span className="text-accent">●</span> Lærdom
        </Link>

        {courseId && courseId !== 'ny' && (
          <div className="flex gap-1">
            <Link
              href={`/kurs/${courseId}`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !isEditor ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink hover:bg-bg-warm'
              }`}
            >
              <BookOpen size={14} /> Kursvisning
            </Link>
            <Link
              href={`/kurs/${courseId}/rediger`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isEditor ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink hover:bg-bg-warm'
              }`}
            >
              <PenLine size={14} /> Rediger
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
