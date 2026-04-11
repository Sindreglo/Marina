'use client'

import { useParams } from 'next/navigation'
import { CourseProvider } from '@/contexts/CourseContext'

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>()
  return <CourseProvider id={params.id}>{children}</CourseProvider>
}
