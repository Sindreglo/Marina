import { ImageIcon, Play } from 'lucide-react'
import type { Lesson } from '@/types/course'

export function LessonContent({ lesson, isEditor = false }: { lesson: Lesson; isEditor?: boolean }) {
  if (lesson.type === 'text') {
    return (
      <p className="text-[15.5px] leading-[1.75] text-ink whitespace-pre-wrap">
        {lesson.content}
      </p>
    )
  }

  if (lesson.type === 'image') {
    return (
      <div>
        <div className="h-56 rounded-xl border border-border flex flex-col items-center justify-center text-ink-muted mb-3"
          style={{ background: 'linear-gradient(135deg, var(--color-bg-warm) 0%, var(--color-border) 100%)' }}>
          <ImageIcon size={24} />
          <span className="text-[13px] mt-1.5">
            {isEditor ? 'Klikk for å laste opp bilde' : 'Bilde'}
          </span>
        </div>
        {lesson.content && (
          <p className="text-[14px] text-ink-muted leading-relaxed">{lesson.content}</p>
        )}
      </div>
    )
  }

  if (lesson.type === 'video') {
    return (
      <div>
        <div className="h-64 rounded-xl flex items-center justify-center relative cursor-pointer mb-3"
          style={{ background: 'linear-gradient(135deg, #1A1612 0%, #2a2520 100%)' }}>
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Play size={20} className="text-white ml-1" fill="white" />
          </div>
          <span className="absolute bottom-3 right-3 text-xs text-white bg-black/70 px-2 py-0.5 rounded">
            {lesson.duration}
          </span>
        </div>
        {lesson.content && (
          <p className="text-[14px] text-ink-muted leading-relaxed">{lesson.content}</p>
        )}
      </div>
    )
  }

  return null
}
