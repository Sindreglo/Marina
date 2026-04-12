import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, collection, runTransaction } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { courseId, userId, rating } = body ?? {}

  if (
    typeof courseId !== 'string' || !courseId ||
    typeof userId !== 'string' || !userId ||
    typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)
  ) {
    return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
  }

  const courseRef = doc(db, 'courses', courseId)
  const ratingRef = doc(collection(db, 'courses', courseId, 'ratings'), userId)

  try {
    await runTransaction(db, async (transaction) => {
      const [courseSnap, ratingSnap] = await Promise.all([
        transaction.get(courseRef),
        transaction.get(ratingRef),
      ])

      if (!courseSnap.exists()) throw new Error('Kurset finnes ikke')

      const courseData = courseSnap.data()
      const currentSum: number = courseData.ratingSum ?? 0
      const currentCount: number = courseData.ratingCount ?? 0
      const oldRating: number = ratingSnap.exists() ? ratingSnap.data().rating : 0

      const newSum = ratingSnap.exists()
        ? currentSum - oldRating + rating
        : currentSum + rating
      const newCount = ratingSnap.exists() ? currentCount : currentCount + 1

      transaction.set(ratingRef, { rating, updatedAt: new Date() })
      transaction.update(courseRef, {
        ratingSum: newSum,
        ratingCount: newCount,
        rating: Math.round((newSum / newCount) * 10) / 10,
      })
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ukjent feil'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
