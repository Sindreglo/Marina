'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { createCourse, getTeacherCourses, getTeacherProfile, updateTeacherProfile } from '@/lib/firestore'
import { LoadingScreen } from '@/components/LoadingScreen'
import { CourseCard } from '@/components/landing/CourseCard'
import type { Course } from '@/types/course'
import type { TeacherProfile } from '@/types/teacher'

export default function TeacherPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [profile, setProfile] = useState<TeacherProfile | null>(null)
  const [profileForm, setProfileForm] = useState({ name: '', yearsExperience: 0, bio: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [creating, setCreating] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    Promise.all([getTeacherCourses(user.uid), getTeacherProfile(user.uid)])
      .then(([c, p]) => {
        setCourses(c)
        setProfile(p)
        if (p) setProfileForm({ name: p.name, yearsExperience: p.yearsExperience, bio: p.bio })
      })
      .catch((err) => {
        console.error('Failed to load teacher data:', err)
      })
      .finally(() => setDataLoading(false))
  }, [user])

  if (loading || !user || dataLoading) return <LoadingScreen />

  async function handleNewCourse() {
    if (!user) return
    setCreating(true)
    try {
      const id = await createCourse(user.uid)
      router.push(`/kurs/${id}/rediger`)
    } finally {
      setCreating(false)
    }
  }

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    setSaveError('')
    try {
      await updateTeacherProfile(user.uid, profileForm)
      setProfile((p) => (p ? { ...p, ...profileForm } : p))
    } catch {
      setSaveError('Kunne ikke lagre profilen. Prøv igjen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Dine kurs</h1>
        <button
          onClick={handleNewCourse}
          disabled={creating}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-[13px] font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <Plus size={14} /> {creating ? 'Oppretter...' : 'Nytt kurs'}
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-ink-muted text-[14px] mb-12">Du har ingen kurs ennå.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              href={`/kurs/${course.id}/rediger`}
              showPublished
            />
          ))}
        </div>
      )}

      <div className="border-t border-border pt-8">
        <h2 className="font-serif text-xl mb-5">Din profil</h2>
        <div className="flex flex-col gap-3 max-w-md">
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">Navn</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-[14px] outline-none focus:border-accent transition-colors"
              placeholder="Ditt navn"
            />
          </div>
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">År med erfaring</label>
            <input
              type="number"
              min={0}
              value={profileForm.yearsExperience}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, yearsExperience: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-[14px] outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">Om</label>
            <textarea
              rows={4}
              value={profileForm.bio}
              onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-[14px] outline-none focus:border-accent transition-colors resize-none"
              placeholder="Fortell om deg selv..."
            />
          </div>
          {saveError && <p className="text-[13px] text-red-500">{saveError}</p>}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="self-start px-4 py-2 bg-ink text-white text-[13px] font-semibold rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Lagrer...' : 'Lagre profil'}
          </button>
        </div>
      </div>
    </div>
  )
}
