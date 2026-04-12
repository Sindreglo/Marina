'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getTeacherProfile, createTeacherProfile } from '@/lib/firestore'
import { useAuthContext } from '@/contexts/AuthContext'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user: currentUser, loading: authLoading } = useAuthContext()

  useEffect(() => {
    if (!authLoading && currentUser) router.replace('/teacher')
  }, [currentUser, authLoading, router])

  if (authLoading) return <LoadingScreen />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    let user
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      user = credential.user
    } catch {
      setError('Feil e-post eller passord. Prøv igjen.')
      setLoading(false)
      return
    }
    try {
      const profile = await getTeacherProfile(user.uid)
      if (!profile) await createTeacherProfile(user.uid)
    } catch {
      console.error('Failed to load/create teacher profile for', user.uid)
    }
    setLoading(false)
    router.push('/teacher')
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-serif text-3xl tracking-tight">
            <span className="text-accent">●</span> Marina
          </span>
          <p className="mt-2 text-[13px] text-ink-muted">Logg inn som lærer</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-muted outline-none focus:border-accent transition-colors"
          />
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-muted outline-none focus:border-accent transition-colors"
          />
          {error && <p className="text-[13px] text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-accent py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </form>
      </div>
    </div>
  )
}
