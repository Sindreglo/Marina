import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Course } from '@/types/course'
import type { TeacherProfile } from '@/types/teacher'

export async function getCourses(): Promise<Course[]> {
  const q = query(collection(db, 'courses'), where('published', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Course)
}

export async function getCourse(id: string): Promise<Course | null> {
  const snap = await getDoc(doc(db, 'courses', id))
  if (!snap.exists()) return null
  return { ...snap.data(), id: snap.id } as Course
}

export async function getTeacherCourses(uid: string): Promise<Course[]> {
  const q = query(collection(db, 'courses'), where('teacherId', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Course)
}

// Strips id and createdAt before writing — caller passes the full Course object
export async function updateCourse(id: string, course: Course): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, createdAt: _ts, ...data } = course
  await updateDoc(doc(db, 'courses', id), data as Record<string, unknown>)
}

export async function createCourse(teacherId: string): Promise<string> {
  const ref = await addDoc(collection(db, 'courses'), {
    title: 'Nytt kurs',
    description: '',
    category: 'Annet',
    level: 'Nybegynner',
    coverColor: '#E8553D',
    instructor: '',
    teacherId,
    students: 0,
    rating: 0,
    published: false,
    createdAt: serverTimestamp(),
    modules: [],
  })
  return ref.id
}

export async function getTeacherProfile(uid: string): Promise<TeacherProfile | null> {
  const snap = await getDoc(doc(db, 'teachers', uid))
  if (!snap.exists()) return null
  return { ...snap.data(), uid: snap.id } as TeacherProfile
}

export async function createTeacherProfile(uid: string): Promise<void> {
  await setDoc(doc(db, 'teachers', uid), {
    uid,
    name: '',
    yearsExperience: 0,
    bio: '',
    createdAt: serverTimestamp(),
  })
}

export async function updateTeacherProfile(
  uid: string,
  data: Partial<Omit<TeacherProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  await setDoc(doc(db, 'teachers', uid), data as Record<string, unknown>, { merge: true })
}
