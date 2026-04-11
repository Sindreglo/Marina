import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import type { Course } from '@/types/course'

export function CourseCard({ course, href, showPublished }: {
  course: Course
  href?: string
  showPublished?: boolean
}) {
  const link = href ?? `/kurs/${course.id}`

  return (
    <Link
      href={link}
      className="group block bg-bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="h-28 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${course.coverColor} 0%, ${course.coverColor}BB 100%)` }}
      >
        <BookOpen className="text-white/20 scale-[3]" size={20} />
        <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold px-2 py-1 rounded-md bg-white/20 text-white backdrop-blur-sm">
          {course.category}
        </span>
        {showPublished && (
          <span className={`absolute top-2.5 right-2.5 text-[11px] font-semibold px-2 py-1 rounded-md backdrop-blur-sm ${
            course.published ? 'bg-green/80 text-white' : 'bg-black/30 text-white/80'
          }`}>
            {course.published ? 'Publisert' : 'Skjult'}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold mb-1.5 leading-snug">{course.title || 'Uten tittel'}</h3>
        {course.description && (
          <p className="text-[13px] text-ink-muted leading-snug line-clamp-2">{course.description}</p>
        )}
      </div>
    </Link>
  )
}
