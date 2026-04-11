'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, PenLine, Save, Globe, ArrowLeft } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthContext } from '@/contexts/AuthContext'
import { useEditorContext } from '@/contexts/EditorContext'
import { getTeacherProfile } from '@/lib/firestore'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthContext()
  const editor = useEditorContext()
  const match = pathname.match(/^\/kurs\/([^/]+)/)
  const courseId = match?.[1] ?? null
  const isEditor = pathname.endsWith('/rediger')

  const isOwnerNav = courseId && courseId !== 'ny' && editor.controls !== null

  const [teacherName, setTeacherName] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setTeacherName(null); return }
    getTeacherProfile(user.uid).then((p) => setTeacherName(p?.name || null))
  }, [user])

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
        {isOwnerNav ? (
          <>
            <div className="flex items-center gap-1">
              <Link href="/" className="font-serif text-xl tracking-tight flex items-center gap-2 shrink-0 mr-3">
                <span className="text-accent">●</span> Lærdom
              </Link>
              <Link
                href="/teacher"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-bg-warm transition-colors"
              >
                <ArrowLeft size={14} /> Tilbake
              </Link>
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
                <PenLine size={14} /> Editor
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={editor.controls!.onSave}
                disabled={editor.controls!.saving || !editor.controls!.canSave}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-ink text-white text-[13px] font-semibold rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                <Save size={13} /> {editor.controls!.saving ? 'Lagrer...' : 'Lagre'}
              </button>
              <button
                onClick={editor.controls!.onTogglePublish}
                disabled={editor.controls!.saving}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                  editor.controls!.published
                    ? 'bg-green text-white hover:bg-green/90'
                    : 'bg-accent text-white hover:bg-accent-hover'
                }`}
              >
                <Globe size={13} /> {editor.controls!.published ? 'Avpubliser' : 'Publiser'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-8">
              <Link href="/" className="font-serif text-xl tracking-tight flex items-center gap-2 shrink-0">
                <span className="text-accent">●</span> Lærdom
              </Link>
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
          </>
        )}
      </div>
    </nav>
  )
}
