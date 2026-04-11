'use client'

import { useState, useCallback } from 'react'

function storageKey(courseId: string) {
  return `progress:${courseId}`
}

export function useProgress(courseId: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    const raw = localStorage.getItem(storageKey(courseId))
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  })

  const toggle = useCallback(
    (lessonId: string) => {
      setCompleted((prev) => {
        const next = new Set(prev)
        if (next.has(lessonId)) next.delete(lessonId)
        else next.add(lessonId)
        localStorage.setItem(storageKey(courseId), JSON.stringify([...next]))
        return next
      })
    },
    [courseId]
  )

  return { completed, toggle }
}
