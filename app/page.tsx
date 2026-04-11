'use client'

import { useCourses } from '@/hooks/useCourses'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsRow } from '@/components/landing/StatsRow'
import { CourseCard } from '@/components/landing/CourseCard'
import { CtaBanner } from '@/components/landing/CtaBanner'

export default function LandingPage() {
  const { courses, loading } = useCourses()

  return (
    <main>
      <HeroSection />
      <StatsRow />

      <section id="kurs" className="max-w-5xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl">Populære kurs</h2>
          <span className="text-sm text-accent font-semibold">Se alle →</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-14">
        <CtaBanner />
      </section>
    </main>
  )
}
