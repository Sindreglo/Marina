'use client'

import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { updateCourse as firestoreUpdate } from '@/lib/firestore'
import type { Course } from '@/types/course'

export function useCourse(id: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'courses', id), (snap) => {
      setCourse(snap.exists() ? ({ ...snap.data(), id: snap.id } as Course) : null)
      setLoading(false)
    })
    return unsub
  }, [id])

  function updateCourse(updated: Course) {
    return firestoreUpdate(id, updated)
  }

  return { course, loading, updateCourse }
}
