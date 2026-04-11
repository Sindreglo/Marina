import Link from 'next/link'
import { BookOpen, Star } from 'lucide-react'
import type { Course } from '@/types/course'

export function CourseCard({ course }: { course: Course }) {
  const lessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <Link
      href={`/kurs/${course.id}`}
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
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold mb-2 leading-snug">{course.title}</h3>
        <div className="flex justify-between text-xs text-ink-light">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            {course.rating.toFixed(1)}
          </span>
          <span>{lessonCount} leksjoner</span>
          <span>{course.students.toLocaleString('nb-NO')} studenter</span>
        </div>
      </div>
    </Link>
  )
}
