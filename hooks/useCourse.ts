'use client'

import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { updateCourse as firestoreUpdate } from '@/lib/firestore'
import type { Course } from '@/types/course'

export function useCourse(id: string | null) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    const unsub = onSnapshot(
      doc(db, 'courses', id),
      (snap) => {
        setCourse(snap.exists() ? ({ ...snap.data(), id: snap.id } as Course) : null)
        setLoading(false)
      },
      (err) => {
        console.error('useCourse snapshot error:', err)
        setError(err)
        setLoading(false)
      }
    )
    return unsub
  }, [id])

  const updateCourse = useCallback(
    (updated: Course) => id ? firestoreUpdate(id, updated) : Promise.reject(new Error('Course ID is not available')),
    [id]
  )

  return { course, loading, error, updateCourse }
}
