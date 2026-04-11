import type { Timestamp } from 'firebase/firestore'

export interface TeacherProfile {
  uid: string
  name: string
  yearsExperience: number
  bio: string
  createdAt: Timestamp
}
