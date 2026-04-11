'use client'

import { FileText, ImageIcon, Video } from 'lucide-react'
import type { Lesson, LessonType } from '@/types/course'
import { LessonContent } from '@/components/course/LessonContent'

const TYPE_ICON: Record<LessonType, React.ReactNode> = {
  text: <FileText size={14} />,
  image: <ImageIcon size={14} />,
  video: <Video size={14} />,
}
const TYPE_LABEL: Record<LessonType, string> = {
  text: 'Tekst', image: 'Bilde', video: 'Video',
}

export function EditableLesson({ lesson, onChange }: { lesson: Lesson; onChange: (updated: Lesson) => void }) {
  function set<K extends keyof Lesson>(key: K, value: Lesson[K]) {
    onChange({ ...lesson, [key]: value })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted bg-bg-warm px-2.5 py-1 rounded-md">
          {TYPE_ICON[lesson.type]} {TYPE_LABEL[lesson.type]}
        </span>
        <input
          value={lesson.duration}
          onChange={(e) => set('duration', e.target.value)}
          className="w-20 px-2 py-1 text-[12px] text-ink-muted border border-border rounded-md outline-none focus:border-accent transition-colors bg-white"
          placeholder="10 min"
        />
      </div>

      <input
        value={lesson.title}
        onChange={(e) => set('title', e.target.value)}
        className="w-full font-serif text-[24px] border-b-2 border-border pb-2 mb-5 outline-none focus:border-accent transition-colors bg-transparent"
        placeholder="Leksjonstittel..."
      />

      {(lesson.type === 'image' || lesson.type === 'video') && (
        <div className="mb-4">
          <LessonContent lesson={lesson} isEditor />
        </div>
      )}

      <label className="block text-[12px] font-semibold uppercase tracking-wide text-ink-muted mb-2">
        {lesson.type === 'text' ? 'Innhold' : 'Beskrivelse'}{lesson.type !== 'text' && <span className="ml-1.5 normal-case font-normal text-ink-light tracking-normal">— valgfritt</span>}
      </label>
      <textarea
        value={lesson.content}
        onChange={(e) => set('content', e.target.value)}
        className="w-full px-3 py-3 border border-border rounded-lg outline-none text-[15px] transition-colors focus:border-accent leading-relaxed resize-y bg-white"
        style={{ minHeight: lesson.type === 'text' ? 240 : 80 }}
        placeholder={lesson.type === 'text' ? 'Skriv innholdet her...' : 'Legg til en beskrivelse...'}
      />
    </div>
  )
}
