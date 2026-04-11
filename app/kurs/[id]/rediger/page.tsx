'use client'

import { Suspense, useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Save, Globe } from 'lucide-react'
import { useCourse } from '@/hooks/useCourse'
import { flatLessons } from '@/lib/utils'
import { CourseSidebar } from '@/components/course/CourseSidebar'
import { EditableLesson } from '@/components/editor/EditableLesson'
import { NavButtons } from '@/components/course/NavButtons'
import type { Course, LessonType, Module, Lesson } from '@/types/course'

function CourseEditor() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const { course, loading, updateCourse } = useCourse(params.id)
  const [draft, setDraft] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (course && !draft) setDraft(course)
  }, [course, draft])

  if (loading || !draft) {
    return <div className="flex h-[calc(100vh-56px)] items-center justify-center text-ink-muted">Laster...</div>
  }

  const flat = flatLessons(draft)
  const activeId = searchParams.get('leksjon') ?? flat[0]?.id ?? ''
  const active = flat.find((l) => l.id === activeId) ?? flat[0]
  const idx = flat.findIndex((l) => l.id === activeId)
  const prev = idx > 0 ? flat[idx - 1] : null
  const next = idx < flat.length - 1 ? flat[idx + 1] : null

  function navigate(id: string) {
    router.replace(`/kurs/${params.id}/rediger?leksjon=${id}`, { scroll: false })
  }

  function updateLesson(updated: Lesson) {
    setDraft((d) => !d ? d : {
      ...d,
      modules: d.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === updated.id ? updated : l)),
      })),
    })
  }

  function addLesson(moduleId: string, type: LessonType) {
    const id = `l${Date.now()}`
    const lesson: Lesson = { id, type, title: '', content: '', duration: '5 min', order: 0 }
    setDraft((d) => !d ? d : {
      ...d,
      modules: d.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
      ),
    })
    setTimeout(() => navigate(id), 10)
  }

  function deleteLesson(moduleId: string, lessonId: string) {
    setDraft((d) => !d ? d : {
      ...d,
      modules: d.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      ),
    })
    if (activeId === lessonId) {
      const remaining = flat.filter((l) => l.id !== lessonId)
      if (remaining[0]) navigate(remaining[0].id)
    }
  }

  function addModule() {
    const moduleId = `m${Date.now()}`
    const lessonId = `l${Date.now() + 1}`
    const lesson: Lesson = { id: lessonId, type: 'text', title: '', content: '', duration: '5 min', order: 0 }
    setDraft((d) => {
      if (!d) return d
      const module: Module = { id: moduleId, title: 'Ny modul', order: d.modules.length, lessons: [lesson] }
      return { ...d, modules: [...d.modules, module] }
    })
    setTimeout(() => navigate(lessonId), 10)
  }

  async function save() {
    if (!draft) return
    setSaving(true)
    try { await updateCourse(draft) } finally { setSaving(false) }
  }

  async function togglePublish() {
    if (!draft) return
    const updated = { ...draft, published: !draft.published }
    setDraft(updated)
    await updateCourse(updated)
  }

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <CourseSidebar
        course={draft}
        activeId={activeId}
        onSelect={navigate}
        isEditor
        onAddLesson={addLesson}
        onDeleteLesson={deleteLesson}
        onAddModule={addModule}
      />

      {active ? (
        <div key={active.id} className="flex-1 overflow-y-auto flex flex-col animate-fade-in">
          {/* Toolbar */}
          <div className="sticky top-0 border-b border-border px-9 py-3 flex items-center justify-between shrink-0"
            style={{ background: 'rgba(250,249,247,0.9)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-2 text-[12px] text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-yellow-400" /> Kladd
            </div>
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-ink text-white text-[13px] font-semibold rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                <Save size={13} /> {saving ? 'Lagrer...' : 'Lagre'}
              </button>
              <button
                onClick={togglePublish}
                className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors ${
                  draft.published ? 'bg-green text-white hover:bg-green/90' : 'bg-accent text-white hover:bg-accent-hover'
                }`}
              >
                <Globe size={13} /> {draft.published ? 'Avpubliser' : 'Publiser'}
              </button>
            </div>
          </div>

          {/* Editor body */}
          <div className="flex-1 px-9 py-8">
            <p className="text-[13px] text-ink-light mb-5">
              <span className="text-accent font-semibold">{active.moduleTitle}</span>
              <span className="mx-1.5">›</span>
              <span>Redigerer leksjon {active.lessonIndex + 1}</span>
            </p>
            <EditableLesson lesson={active} onChange={updateLesson} />
            <div className="mt-9">
              <NavButtons prev={prev} next={next} onNav={navigate} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-ink-muted text-[15px]">
          Ingen leksjoner ennå — legg til en modul i sidemenyen.
        </div>
      )}
    </div>
  )
}

export default function CourseEditorPage() {
  return <Suspense><CourseEditor /></Suspense>
}
