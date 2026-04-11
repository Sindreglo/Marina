'use client'

import { createContext, useContext } from 'react'
import { useCourse } from '@/hooks/useCourse'
import { deleteCourse as firestoreDelete } from '@/lib/firestore'
import type { Course } from '@/types/course'

interface CourseContextValue {
  course: Course | null
  loading: boolean
  updateCourse: (updated: Course) => Promise<void>
  deleteCourse: () => Promise<void>
}

const CourseContext = createContext<CourseContextValue>({
  course: null,
  loading: true,
  updateCourse: async () => {},
  deleteCourse: async () => {},
})

export function CourseProvider({ id, children }: { id: string; children: React.ReactNode }) {
  const value = useCourse(id)
  const deleteCourse = () => firestoreDelete(id)
  return <CourseContext.Provider value={{ ...value, deleteCourse }}>{children}</CourseContext.Provider>
}

export function useCourseContext() {
  return useContext(CourseContext)
}
