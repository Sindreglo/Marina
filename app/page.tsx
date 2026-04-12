'use client'

import { useCourses } from '@/hooks/useCourses'
import { HeroSection } from '@/components/landing/HeroSection'
import { CourseCard } from '@/components/landing/CourseCard'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  const { courses, loading } = useCourses()

  return (
    <main>
      <HeroSection />

      <section id="kurs" className="max-w-5xl mx-auto px-6 pb-12 pt-10">
        <h2 className="font-serif text-2xl mb-5">Kurs</h2>

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

      <Footer />
    </main>
  )
}
