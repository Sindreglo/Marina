'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, PenLine } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthContext } from '@/contexts/AuthContext'
import { getTeacherProfile } from '@/lib/firestore'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthContext()
  const match = pathname.match(/^\/kurs\/([^/]+)/)

  const [teacherName, setTeacherName] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setTeacherName(null); return }
    getTeacherProfile(user.uid).then((p) => setTeacherName(p?.name || null))
  }, [user])
  const courseId = match?.[1] ?? null
  const isEditor = pathname.endsWith('/rediger')

  async function handleSignOut() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      router.push('/')
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border" style={{ background: 'rgba(250,249,247,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
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

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/' ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink hover:bg-bg-warm'
                }`}
              >
                Landingsside
              </Link>
              <Link
                href="/teacher"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/teacher') ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink hover:bg-bg-warm'
                }`}
              >
                {teacherName || 'Min side'}
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-bg-warm transition-colors"
              >
                Logg ut
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-[13px] font-medium border border-border rounded-lg px-3.5 py-1.5 text-ink hover:border-ink/30 transition-colors"
            >
              Logg inn
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
