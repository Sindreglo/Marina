import type { Course, Lesson } from '@/types/course'

export interface FlatLesson extends Lesson {
  moduleId: string
  moduleTitle: string
  lessonIndex: number
}

export function flatLessons(course: Course): FlatLesson[] {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson, li) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      lessonIndex: li,
    }))
  )
}
