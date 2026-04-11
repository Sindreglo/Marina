'use client'

import { useState, useEffect } from 'react'
import { getCourses } from '@/lib/firestore'
import type { Course } from '@/types/course'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .finally(() => setLoading(false))
  }, [])

  return { courses, loading }
}
