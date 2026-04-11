'use client'

import { Check, FileText, ImageIcon, Video, Plus, Trash2 } from 'lucide-react'
import type { Course, LessonType } from '@/types/course'
import { flatLessons } from '@/lib/utils'

const TYPE_ICON: Record<LessonType, React.ReactNode> = {
  text: <FileText size={15} />,
  image: <ImageIcon size={15} />,
  video: <Video size={15} />,
}
const TYPE_LABEL: Record<LessonType, string> = {
  text: 'Tekst',
  image: 'Bilde',
  video: 'Video',
}

interface Props {
  course: Course
  activeId: string
  completed?: Set<string>
  onSelect: (lessonId: string) => void
  isEditor?: boolean
  onAddLesson?: (moduleId: string, type: LessonType) => void
  onDeleteLesson?: (moduleId: string, lessonId: string) => void
  onAddModule?: () => void
}

export function CourseSidebar({
  course,
  activeId,
  completed = new Set(),
  onSelect,
  isEditor = false,
  onAddLesson,
  onDeleteLesson,
  onAddModule,
}: Props) {
  const flat = flatLessons(course)
  const doneCount = flat.filter((l) => completed.has(l.id)).length

  return (
    <aside className="w-72 shrink-0 bg-bg-card border-r border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-light mb-1.5">
          {isEditor ? 'Redigerer kurs' : 'Kursinnhold'}
        </p>
        <p className="text-[15px] font-semibold leading-snug">{course.title}</p>
        {!isEditor && flat.length > 0 && (
          <>
            <div className="mt-2.5 h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-green rounded-full transition-[width] duration-500"
                style={{ width: `${(doneCount / flat.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-ink-light mt-1.5">
              {doneCount} av {flat.length} fullført
            </p>
          </>
        )}
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-y-auto py-2">
        {course.modules.map((module, mi) => (
          <div key={module.id}>
            <div className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-light">
              <span className="w-4 h-4 rounded text-[10px] font-extrabold bg-accent-soft text-accent inline-flex items-center justify-center shrink-0">
                {mi + 1}
              </span>
              {module.title}
            </div>

            {module.lessons.map((lesson) => {
              const isActive = lesson.id === activeId
              const isDone = completed.has(lesson.id)
              const rowClass = `w-full text-left flex items-center gap-2.5 pl-7 pr-3 py-2.5 border-r-[3px] transition-all duration-100 ${
                isActive ? 'bg-accent-soft border-accent' : 'border-transparent hover:bg-bg-warm'
              }`
              const inner = (
                <>
                  {!isEditor ? (
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-green text-white' : 'border-[1.5px] border-border text-ink-light'
                      }`}
                    >
                      {isDone && <Check size={11} strokeWidth={3} />}
                    </span>
                  ) : (
                    <span className={`shrink-0 ${isActive ? 'text-accent' : 'text-ink-light'}`}>
                      {TYPE_ICON[lesson.type]}
                    </span>
                  )}
                  <span
                    className={`text-[13px] flex-1 truncate ${
                      isActive ? 'font-semibold text-accent' : isDone && !isEditor ? 'text-ink-muted' : 'text-ink'
                    }`}
                  >
                    {lesson.title || 'Uten tittel'}
                  </span>
                  <span className="text-[11px] text-ink-light shrink-0">{lesson.duration} min</span>
                </>
              )
              return isEditor ? (
                <div
                  key={lesson.id}
                  className={rowClass}
                  onClick={() => onSelect(lesson.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelect(lesson.id)}
                >
                  {inner}
                  {onDeleteLesson && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteLesson(module.id, lesson.id) }}
                      className="text-ink-light hover:text-accent shrink-0 p-0.5 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  key={lesson.id}
                  onClick={() => onSelect(lesson.id)}
                  className={rowClass}
                >
                  {inner}
                </button>
              )
            })}

            {isEditor && onAddLesson && (
              <div className="flex gap-1 pl-7 pr-4 py-2 flex-wrap">
                {(['text', 'image', 'video'] as LessonType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => onAddLesson(module.id, type)}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] text-ink-light border border-dashed border-border rounded-md hover:border-accent hover:text-accent transition-all"
                  >
                    <Plus size={11} /> {TYPE_LABEL[type]}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isEditor && onAddModule && (
          <div className="px-4 py-2">
            <button
              onClick={onAddModule}
              className="w-full py-2.5 text-[13px] font-semibold text-ink-muted border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-1.5 hover:border-accent hover:text-accent transition-all"
            >
              <Plus size={15} /> Ny modul
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
