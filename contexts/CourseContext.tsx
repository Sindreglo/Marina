'use client'

import { createContext, useContext } from 'react'
import { useCourse } from '@/hooks/useCourse'
import type { Course } from '@/types/course'

interface CourseContextValue {
  course: Course | null
  loading: boolean
  updateCourse: (updated: Course) => Promise<void>
}

const CourseContext = createContext<CourseContextValue>({
  course: null,
  loading: true,
  updateCourse: async () => {},
})

export function CourseProvider({ id, children }: { id: string; children: React.ReactNode }) {
  const value = useCourse(id)
  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
}

export function useCourseContext() {
  return useContext(CourseContext)
}
