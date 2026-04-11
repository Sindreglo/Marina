'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { flatLessons } from '@/lib/utils'
import { CourseSidebar } from '@/components/course/CourseSidebar'
import { EditableLesson } from '@/components/editor/EditableLesson'
import { EditableCourseInfo } from '@/components/editor/EditableCourseInfo'
import { NavButtons } from '@/components/course/NavButtons'
import { useAuthContext } from '@/contexts/AuthContext'
import { LoadingScreen } from '@/components/LoadingScreen'
import { useEditorContext } from '@/contexts/EditorContext'
import { useCourseContext } from '@/contexts/CourseContext'
import type { Course, LessonType, Module, Lesson } from '@/types/course'

function CourseEditor() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuthContext()
  const { setControls } = useEditorContext()

  const { course, loading, updateCourse, deleteCourse } = useCourseContext()
  const [draft, setDraft] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const draftRef = useRef(draft)
  draftRef.current = draft

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (course && !draft) setDraft(course)
  }, [course, draft])

  async function save() {
    const d = draftRef.current
    if (!d) return
    setSaving(true)
    try { await updateCourse(d) } finally { setSaving(false) }
  }

  async function togglePublish() {
    const d = draftRef.current
    if (!d) return
    const updated = { ...d, published: !d.published }
    setDraft(updated)
    setSaving(true)
    try {
      await updateCourse(updated)
    } catch {
      setDraft(d)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!draft) return
    setControls({ saving, published: draft.published, canSave: true, onSave: save, onTogglePublish: togglePublish })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, draft?.published])

  useEffect(() => () => setControls(null), [])

  if (authLoading || !user || loading || !draft) {
    return <LoadingScreen />
  }

  function newId() {
    return Math.random().toString(36).slice(2, 10)
  }

  const flat = flatLessons(draft)
  const activeId = searchParams.get('leksjon') ?? 'kursinfo'
  const isCourseInfo = activeId === 'kursinfo'
  const active = isCourseInfo ? null : (flat.find((l) => l.id === activeId) ?? flat[0] ?? null)
  const idx = active ? flat.findIndex((l) => l.id === active.id) : -1
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
    const id = `l${newId()}`
    const lesson: Lesson = { id, type, title: '', content: '', duration: 5, order: 0 }
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

  function renameLesson(lessonId: string, title: string) {
    setDraft((d) => !d ? d : {
      ...d,
      modules: d.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, title } : l),
      })),
    })
  }

  function renameModule(moduleId: string, title: string) {
    setDraft((d) => !d ? d : {
      ...d,
      modules: d.modules.map((m) => m.id === moduleId ? { ...m, title } : m),
    })
  }

  function addModule() {
    const moduleId = `m${newId()}`
    const lessonId = `l${newId()}`
    const lesson: Lesson = { id: lessonId, type: 'text', title: '', content: '', duration: 5, order: 0 }
    setDraft((d) => {
      if (!d) return d
      const newModule: Module = { id: moduleId, title: 'Ny modul', order: d.modules.length, lessons: [lesson] }
      return { ...d, modules: [...d.modules, newModule] }
    })
    setTimeout(() => navigate(lessonId), 10)
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
        onRenameModule={renameModule}
        onRenameLesson={renameLesson}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {isCourseInfo ? (
        <div key="kursinfo" className="flex-1 overflow-y-auto animate-fade-in">
          <div className="px-5 md:px-9 py-6 md:py-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden mb-4 p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-warm transition-colors"
            >
              <Menu size={18} />
            </button>
            <EditableCourseInfo
              draft={draft}
              onChange={(updated) => setDraft(updated)}
              onDelete={async () => { await deleteCourse(); router.push('/teacher') }}
            />
          </div>
        </div>
      ) : active ? (
        <div key={active.id} className="flex-1 flex flex-col overflow-hidden animate-fade-in">
          <div className="flex-1 overflow-y-auto">
            <div className="min-h-full flex flex-col px-5 md:px-9 items-center">
              <div className="flex-1 py-6 md:py-8 max-w-2xl w-full">
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
                    <span>Redigerer leksjon {active.lessonIndex + 1}</span>
                  </p>
                </div>
                <EditableLesson lesson={active} onChange={updateLesson} />
              </div>
              <div className="pb-6 max-w-2xl w-full">
                <NavButtons prev={prev} next={next} onNav={navigate} />
              </div>
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
