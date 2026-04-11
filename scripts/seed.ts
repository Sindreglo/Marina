import { config } from 'dotenv'
config({ path: '.env.local' })

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
})
const db = getFirestore(app)

const COURSES = [
  {
    title: 'Introduksjon til Webdesign',
    description: 'Lær grunnleggende HTML, CSS og designprinsipper for å bygge moderne nettsider.',
    category: 'Teknologi',
    level: 'Nybegynner',
    coverColor: '#E8553D',
    instructor: 'Marte Nordahl',
    students: 284,
    rating: 4.8,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Grunnleggende HTML', order: 0,
        lessons: [
          { id: 'l1', type: 'text', title: 'Hva er HTML?', duration: '8 min', order: 0,
            content: 'HTML (HyperText Markup Language) er grunnspråket for alle nettsider. Det definerer strukturen og innholdet på en side ved hjelp av elementer og tagger.\n\nHver HTML-side starter med en <!DOCTYPE html> deklarasjon, etterfulgt av <html>, <head> og <body> tagger.\n\nDe vanligste elementene er overskrifter (<h1> til <h6>), avsnitt (<p>), lenker (<a>), bilder (<img>) og lister (<ul>, <ol>).' },
          { id: 'l2', type: 'image', title: 'HTML-dokumentstruktur', duration: '5 min', order: 1,
            content: 'Illustrasjon som viser den hierarkiske strukturen til et HTML-dokument.' },
          { id: 'l3', type: 'video', title: 'Din første nettside', duration: '15 min', order: 2,
            content: 'I denne videoen bygger vi en enkel nettside fra bunnen av.' },
        ],
      },
      {
        id: 'm2', title: 'CSS Styling', order: 1,
        lessons: [
          { id: 'l4', type: 'text', title: 'Introduksjon til CSS', duration: '10 min', order: 0,
            content: 'CSS (Cascading Style Sheets) kontrollerer utseendet til HTML-elementer. Med CSS kan du endre farger, fonter, layout og mye mer.\n\nDet finnes tre måter å legge til CSS: inline, internt og eksternt. Ekstern CSS er best praksis.' },
          { id: 'l5', type: 'text', title: 'Farger og typografi', duration: '12 min', order: 1,
            content: 'Farger i CSS kan angis med navn, hex-koder, RGB eller HSL. For typografi bruker man font-family, font-size, font-weight og line-height.' },
        ],
      },
    ],
  },
  {
    title: 'Fotografering for Nybegynnere',
    description: 'Lær å ta gode bilder med kameraet du har — mobil eller speilrefleks.',
    category: 'Kreativ',
    level: 'Nybegynner',
    coverColor: '#2D8E6A',
    instructor: 'Erik Solheim',
    students: 156,
    rating: 4.6,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Komposisjon', order: 0,
        lessons: [
          { id: 'l1', type: 'text', title: 'Tredjedelsregelen', duration: '7 min', order: 0,
            content: 'Tredjedelsregelen er en av de mest grunnleggende komposisjonsreglene. Del bildet i et 3x3-rutenett og plasser motivet langs linjene eller i krysningspunktene.' },
          { id: 'l2', type: 'image', title: 'Komposisjonseksempler', duration: '5 min', order: 1,
            content: 'Eksempler på god og dårlig komposisjon side om side.' },
        ],
      },
    ],
  },
  {
    title: 'Grunnleggende Økonomi',
    description: 'Forstå personlig økonomi, budsjettering og grunnleggende investeringsprinsipper.',
    category: 'Business',
    level: 'Nybegynner',
    coverColor: '#3B7DD8',
    instructor: 'Lise Tanberg',
    students: 412,
    rating: 4.9,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Personlig økonomi', order: 0,
        lessons: [
          { id: 'l1', type: 'text', title: 'Lag et budsjett', duration: '10 min', order: 0,
            content: 'Et budsjett er grunnmuren i sunn økonomi. Start med å kartlegge alle inntekter og faste utgifter. Det som er igjen er din disponible inntekt.' },
          { id: 'l2', type: 'video', title: 'Sparing i praksis', duration: '12 min', order: 1,
            content: 'Konkrete tips for å spare mer hver måned uten å ofre livskvalitet.' },
        ],
      },
    ],
  },
]

async function seed() {
  for (const course of COURSES) {
    const ref = await addDoc(collection(db, 'courses'), course)
    console.log(`Opprettet: ${course.title} (${ref.id})`)
  }
  console.log('Ferdig!')
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })
