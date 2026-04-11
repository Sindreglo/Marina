'use client'

import { useState, useRef } from 'react'
import { Check, FileText, ImageIcon, Video, Plus, Trash2, Settings, Pencil, X } from 'lucide-react'
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
  onRenameModule?: (moduleId: string, title: string) => void
  onRenameLesson?: (lessonId: string, title: string) => void
  isOpen?: boolean
  onClose?: () => void
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
  onRenameModule,
  onRenameLesson,
  isOpen = true,
  onClose,
}: Props) {
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const moduleInputRef = useRef<HTMLInputElement>(null)
  const lessonInputRef = useRef<HTMLInputElement>(null)

  function startRenameModule(moduleId: string, currentTitle: string) {
    setEditingLessonId(null)
    setEditingModuleId(moduleId)
    setEditingTitle(currentTitle)
    setTimeout(() => moduleInputRef.current?.select(), 0)
  }

  function commitRenameModule(moduleId: string) {
    onRenameModule?.(moduleId, editingTitle.trim() || 'Ny modul')
    setEditingModuleId(null)
  }

  function startRenameLesson(lessonId: string, currentTitle: string) {
    setEditingModuleId(null)
    setEditingLessonId(lessonId)
    setEditingTitle(currentTitle)
    setTimeout(() => lessonInputRef.current?.select(), 0)
  }

  function commitRenameLesson(lessonId: string) {
    onRenameLesson?.(lessonId, editingTitle.trim() || 'Uten tittel')
    setEditingLessonId(null)
  }

  function handleSelect(id: string) {
    onSelect(id)
    onClose?.()
  }

  const flat = flatLessons(course)
  const doneCount = flat.filter((l) => completed.has(l.id)).length

  const sidebar = (
    <aside className="w-72 shrink-0 bg-bg-card border-r border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-light mb-1.5">
              {isEditor ? 'Redigerer kurs' : 'Kursinnhold'}
            </p>
            <p className="text-[15px] font-semibold leading-snug">{course.title}</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden shrink-0 p-1 text-ink-muted hover:text-ink transition-colors mt-0.5">
              <X size={18} />
            </button>
          )}
        </div>
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
        {isEditor && (
          <button
            onClick={() => handleSelect('kursinfo')}
            className={`mt-3 w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              activeId === 'kursinfo'
                ? 'bg-accent-soft text-accent'
                : 'text-ink-muted hover:text-ink hover:bg-bg-warm'
            }`}
          >
            <Settings size={13} /> Kursinformasjon
          </button>
        )}
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-y-auto py-2">
        {course.modules.map((module, mi) => (
          <div key={module.id}>
            <div className="flex items-center gap-1.5 px-4 py-2.5">
              <span className="w-4 h-4 rounded text-[10px] font-extrabold bg-accent-soft text-accent inline-flex items-center justify-center shrink-0">
                {mi + 1}
              </span>
              {isEditor && editingModuleId === module.id ? (
                <input
                  ref={moduleInputRef}
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => commitRenameModule(module.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRenameModule(module.id)
                    if (e.key === 'Escape') setEditingModuleId(null)
                  }}
                  className="flex-1 text-[11px] font-bold uppercase tracking-wide text-ink-light bg-transparent outline-none border-b border-accent"
                />
              ) : (
                <button
                  onDoubleClick={() => isEditor && startRenameModule(module.id, module.title)}
                  className="group/mod flex items-center gap-1.5 flex-1 min-w-0 text-left"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-light truncate">
                    {module.title}
                  </span>
                  {isEditor && (
                    <Pencil size={10} className="shrink-0 text-ink-light opacity-0 group-hover/mod:opacity-100 transition-opacity" />
                  )}
                </button>
              )}
            </div>

            {module.lessons.map((lesson) => {
              const isActive = lesson.id === activeId
              const isDone = completed.has(lesson.id)
              const isEditingThis = editingLessonId === lesson.id

              if (isEditor) {
                return (
                  <div
                    key={lesson.id}
                    className={`w-full text-left flex items-center gap-2.5 pl-7 pr-3 py-2.5 border-r-[3px] transition-all duration-100 ${
                      isActive ? 'bg-accent-soft border-accent' : 'border-transparent hover:bg-bg-warm'
                    }`}
                    onClick={() => !isEditingThis && handleSelect(lesson.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && !isEditingThis && handleSelect(lesson.id)}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-accent' : 'text-ink-light'}`}>
                      {TYPE_ICON[lesson.type]}
                    </span>
                    {isEditingThis ? (
                      <input
                        ref={lessonInputRef}
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => commitRenameLesson(lesson.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRenameLesson(lesson.id)
                          if (e.key === 'Escape') setEditingLessonId(null)
                          e.stopPropagation()
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 text-[13px] text-ink bg-transparent outline-none border-b border-accent min-w-0"
                      />
                    ) : (
                      <button
                        onDoubleClick={(e) => { e.stopPropagation(); startRenameLesson(lesson.id, lesson.title) }}
                        className="group/les flex items-center gap-1 flex-1 min-w-0 text-left"
                      >
                        <span className={`text-[13px] truncate ${isActive ? 'font-semibold text-accent' : 'text-ink'}`}>
                          {lesson.title || 'Uten tittel'}
                        </span>
                        <Pencil size={10} className="shrink-0 text-ink-light opacity-0 group-hover/les:opacity-100 transition-opacity" />
                      </button>
                    )}
                    <span className="text-[11px] text-ink-light shrink-0">{lesson.duration} min</span>
                    {onDeleteLesson && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteLesson(module.id, lesson.id) }}
                        className="text-ink-light hover:text-accent shrink-0 p-0.5 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                )
              }

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelect(lesson.id)}
                  className={`w-full text-left flex items-center gap-2.5 pl-7 pr-3 py-2.5 border-r-[3px] transition-all duration-100 ${
                    isActive ? 'bg-accent-soft border-accent' : 'border-transparent hover:bg-bg-warm'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-green text-white' : 'border-[1.5px] border-border text-ink-light'
                  }`}>
                    {isDone && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span className={`text-[13px] flex-1 truncate ${
                    isActive ? 'font-semibold text-accent' : isDone ? 'text-ink-muted' : 'text-ink'
                  }`}>
                    {lesson.title || 'Uten tittel'}
                  </span>
                  <span className="text-[11px] text-ink-light shrink-0">{lesson.duration} min</span>
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

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:flex h-full">
        {sidebar}
      </div>

      {/* Mobile: drawer overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative h-full flex">
            {sidebar}
          </div>
        </div>
      )}
    </>
  )
}
