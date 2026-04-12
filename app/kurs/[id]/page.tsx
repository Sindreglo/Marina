'use client'

import { Suspense, useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Check, Menu } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useCourseContext } from '@/contexts/CourseContext'
import { flatLessons } from '@/lib/utils'
import { CourseSidebar } from '@/components/course/CourseSidebar'
import { LessonContent } from '@/components/course/LessonContent'
import { NavButtons } from '@/components/course/NavButtons'
import { RatingModal } from '@/components/course/RatingModal'
import { useAuthContext } from '@/contexts/AuthContext'
import { useEditorContext } from '@/contexts/EditorContext'

function CourseViewer() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthContext()
  const { setControls } = useEditorContext()
  const { course, loading, updateCourse } = useCourseContext()
  const { completed, toggle } = useProgress(params.id)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [anonId] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    const key = 'anon-id'
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = `anon-${Math.random().toString(36).slice(2, 12)}`
    localStorage.setItem(key, id)
    return id
  })

  const ratingUserId = user?.uid ?? anonId

  const isOwner = !!(course && user && course.teacherId === user.uid)

  async function togglePublish() {
    if (!course) return
    const updated = { ...course, published: !course.published }
    setSaving(true)
    try { await updateCourse(updated) } finally { setSaving(false) }
  }

  useEffect(() => {
    if (!isOwner || !course) return
    setControls({ saving, saved: true, published: course.published, canSave: false, onSave: () => {}, onTogglePublish: togglePublish })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, saving, course?.published])

  useEffect(() => () => setControls(null), [])

  if (loading) {
    return <div className="flex h-[calc(100vh-56px)] items-center justify-center text-ink-muted">Laster...</div>
  }
  if (!course) {
    return <div className="flex h-[calc(100vh-56px)] items-center justify-center text-ink-muted">Kurs ikke funnet</div>
  }

  const flat = flatLessons(course)
  const activeId = searchParams.get('leksjon') ?? flat[0]?.id ?? ''
  const active = flat.find((l) => l.id === activeId) ?? flat[0]
  const idx = flat.findIndex((l) => l.id === activeId)
  const prev = idx > 0 ? flat[idx - 1] : null
  const next = idx < flat.length - 1 ? flat[idx + 1] : null

  function navigate(id: string) {
    router.replace(`/kurs/${params.id}?leksjon=${id}`, { scroll: false })
  }

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <CourseSidebar
        course={course}
        activeId={activeId}
        completed={completed}
        onSelect={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {active && (
        <main key={active.id} className="flex-1 overflow-y-auto animate-fade-in">
          <div className="min-h-full flex flex-col px-5 md:px-9">
            <div className="flex-1 py-6 md:py-8 max-w-2xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-warm transition-colors"
                >
                  <Menu size={18} />
                </button>
                <p className="text-[13px] text-ink-light">
                  <span className="text-accent font-semibold">{active.moduleTitle}</span>
                  <span className="mx-1.5">›</span>
                  <span>Leksjon {active.lessonIndex + 1}</span>
                </p>
              </div>
              <h1 className="font-serif text-[26px] md:text-[28px] leading-snug mb-7">{active.title}</h1>
              <LessonContent lesson={active} />
            </div>

            <div className="max-w-2xl mx-auto w-full flex flex-col gap-3 pb-8 pt-4">
              {!isOwner && (
                <button
                  onClick={() => toggle(active.id)}
                  className={`w-full py-3.5 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    completed.has(active.id)
                      ? 'bg-green-soft text-green border-[1.5px] border-green'
                      : 'bg-accent text-white hover:bg-accent-hover'
                  }`}
                >
                  <Check size={16} strokeWidth={3} />
                  {completed.has(active.id) ? 'Fullført — klikk for å angre' : 'Marker som fullført'}
                </button>
              )}
              <NavButtons
                prev={prev}
                next={next}
                onNav={navigate}
                exitHref={!isOwner ? '/' : undefined}
                onFinish={!isOwner && !next ? () => {
                  if (!completed.has(active.id)) toggle(active.id)
                  setShowRating(true)
                } : undefined}
                isFinished={undefined}
              />
            </div>
          </div>
        </main>
      )}
      {showRating && (
        <RatingModal
          courseId={params.id}
          userId={ratingUserId}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  )
}

export default function CourseViewerPage() {
  return <Suspense><CourseViewer /></Suspense>
}
