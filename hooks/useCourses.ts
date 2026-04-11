'use client'

import { useState, useEffect } from 'react'
import { getCourses } from '@/lib/firestore'
import type { Course } from '@/types/course'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { courses, loading, error }
}
