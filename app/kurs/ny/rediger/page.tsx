'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { createCourse } from '@/lib/firestore'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function NewCoursePage() {
  const router = useRouter()
  const { user, loading } = useAuthContext()
  const called = useRef(false)

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/login'); return }
    if (called.current) return
    called.current = true
    createCourse(user.uid)
      .then((id) => {
        router.replace(`/kurs/${id}/rediger`)
      })
      .catch((err) => {
        console.error('Failed to create course:', err)
        router.replace('/teacher')
      })
  }, [router, user, loading])

  return <LoadingScreen />
}
