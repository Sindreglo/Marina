import type { Timestamp } from 'firebase/firestore'

export type LessonType = 'text' | 'image' | 'video'

export interface Lesson {
  id: string
  type: LessonType
  title: string
  content: string
  duration: string
  order: number
}

export interface Module {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  coverColor: string
  instructor: string
  students: number
  rating: number
  published: boolean
  createdAt: Timestamp
  modules: Module[]
}
