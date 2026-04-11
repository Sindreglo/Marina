'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useCourse } from '@/hooks/useCourse'
import { useProgress } from '@/hooks/useProgress'
import { flatLessons } from '@/lib/utils'
import { CourseSidebar } from '@/components/course/CourseSidebar'
import { LessonContent } from '@/components/course/LessonContent'
import { NavButtons } from '@/components/course/NavButtons'

function CourseViewer() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const { course, loading } = useCourse(params.id)
  const { completed, toggle } = useProgress(params.id)

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
      />

      {active && (
        <main key={active.id} className="flex-1 overflow-y-auto animate-fade-in">
          <div className="min-h-full flex flex-col px-9">
            <div className="flex-1 py-8 max-w-2xl mx-auto w-full">
              <p className="text-[13px] text-ink-light mb-5">
                <span className="text-accent font-semibold">{active.moduleTitle}</span>
                <span className="mx-1.5">›</span>
                <span>Leksjon {active.lessonIndex + 1}</span>
              </p>
              <h1 className="font-serif text-[28px] leading-snug mb-7">{active.title}</h1>
              <LessonContent lesson={active} />
            </div>

            <div className="max-w-2xl mx-auto w-full flex flex-col gap-3 pb-8 pt-4">
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
              <NavButtons prev={prev} next={next} onNav={navigate} />
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

export default function CourseViewerPage() {
  return <Suspense><CourseViewer /></Suspense>
}
