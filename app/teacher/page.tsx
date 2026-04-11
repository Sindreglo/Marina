'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { createCourse, getTeacherCourses, submitFeedback } from '@/lib/firestore'
import { LoadingScreen } from '@/components/LoadingScreen'
import { CourseCard } from '@/components/landing/CourseCard'
import type { Course } from '@/types/course'

export default function TeacherPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [creating, setCreating] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [feedbackSaving, setFeedbackSaving] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    getTeacherCourses(user.uid)
      .then(setCourses)
      .catch((err) => console.error('Failed to load courses:', err))
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

  async function handleFeedback() {
    if (!user || !feedback.trim()) return
    setFeedbackSaving(true)
    try {
      await submitFeedback(user.uid, user.email ?? '', feedback.trim())
      setFeedback('')
      setFeedbackSent(true)
      setTimeout(() => setFeedbackSent(false), 3000)
    } finally {
      setFeedbackSaving(false)
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

      <div className="border-t border-border pt-8 max-w-md">
        <h2 className="font-serif text-xl mb-1.5">Tilbakemeldinger</h2>
        <p className="text-[13px] text-ink-muted mb-4">Noe som ikke fungerer, eller en idé du vil dele?</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder="Skriv din tilbakemelding her..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-accent transition-colors resize-none mb-3"
        />
        <button
          onClick={handleFeedback}
          disabled={feedbackSaving || !feedback.trim()}
          className="px-4 py-2 bg-ink text-white text-[13px] font-semibold rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {feedbackSaving ? 'Sender...' : feedbackSent ? 'Takk!' : 'Send tilbakemelding'}
        </button>
      </div>
    </div>
  )
}
