'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse } from '@/lib/firestore'

export default function NewCoursePage() {
  const router = useRouter()
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    createCourse().then((id) => {
      router.replace(`/kurs/${id}/rediger`)
    })
  }, [router])

  return (
    <div className="flex h-[calc(100vh-56px)] items-center justify-center text-ink-muted">
      Oppretter kurs...
    </div>
  )
}
