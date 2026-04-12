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

const TEACHER_ID = 'AoT9q4PAMbTJ8dgifpouGfRDI0x2'

const COURSES = [
  {
    title: 'Algebra for 1P',
    description: 'Grunnleggende algebra tilpasset 1P-pensum. Vi går gjennom likninger, ulikheter og polynomer med mange eksempler og oppgaver.',
    category: 'Algebra',
    level: '1P',
    coverColor: '#2563eb',
    teacherId: TEACHER_ID,
    students: 0,
    rating: 0,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Likninger', order: 0,
        lessons: [
          {
            id: 'l1', type: 'text', title: 'Hva er en likning?', duration: 8, order: 0,
            content: 'En likning er et matematisk utsagn der to uttrykk er like. Vi bruker likninger til å finne ukjente verdier.\n\nEksempel: 2x + 3 = 11\n\nHer er x den ukjente. Vi løser likningen ved å isolere x på én side:\n2x = 11 - 3\n2x = 8\nx = 4\n\nSjekk: 2·4 + 3 = 11 ✓',
          },
          {
            id: 'l2', type: 'text', title: 'Likninger med parentes', duration: 10, order: 1,
            content: 'Når vi har parentes i en likning, må vi multiplisere ut parentesen først.\n\nEksempel: 3(x + 2) = 15\n\nMultipliser ut: 3x + 6 = 15\nTrekk fra 6: 3x = 9\nDel på 3: x = 3\n\nHusk: hvert ledd inne i parentesen multipliseres med faktoren utenfor.',
          },
          {
            id: 'l3', type: 'text', title: 'Likningssett', duration: 12, order: 2,
            content: 'Et likningssett har to eller flere likninger med to eller flere ukjente.\n\nEksempel:\nx + y = 5\nx - y = 1\n\nAddisjon: Legg sammen likningene:\n2x = 6 → x = 3\nSett inn: 3 + y = 5 → y = 2\n\nLøsning: x = 3, y = 2',
          },
        ],
      },
      {
        id: 'm2', title: 'Ulikheter', order: 1,
        lessons: [
          {
            id: 'l4', type: 'text', title: 'Innføring i ulikheter', duration: 7, order: 0,
            content: 'En ulikhet ligner på en likning, men bruker symbolene <, >, ≤ eller ≥ i stedet for =.\n\nEksempel: 2x + 1 > 5\n2x > 4\nx > 2\n\nViktig regel: Multipliserer eller dividerer du med et negativt tall, snur uliketstegnet!\n\nEksempel: -x > 3 → x < -3',
          },
          {
            id: 'l5', type: 'text', title: 'Løsningsmengde og tallinje', duration: 9, order: 1,
            content: 'Løsningsmengden til en ulikhet er alle verdier som gjør ulikheten sann.\n\nx > 2 betyr alle tall større enn 2. Vi tegner dette på en tallinje med en åpen sirkel på 2 og en pil mot høyre.\n\nx ≥ 2 tegnes med lukket sirkel (2 er også med i løsningsmengden).',
          },
        ],
      },
    ],
  },
  {
    title: 'Trigonometri — 1T og 2P',
    description: 'En grundig gjennomgang av trigonometri med sinus, cosinus og tangens. Passer for elever på 1T og 2P.',
    category: 'Trigonometri',
    level: '1T',
    coverColor: '#7c3aed',
    teacherId: TEACHER_ID,
    students: 0,
    rating: 0,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Innledning til trigonometri', order: 0,
        lessons: [
          {
            id: 'l1', type: 'text', title: 'Den rettvinklede trekanten', duration: 8, order: 0,
            content: 'I en rettvinklet trekant er hypotenusen den lengste siden — siden overfor den rette vinkelen.\n\nDe to kortere sidene kalles katet. Vi skiller mellom hosliggende katet (nær vinkelen vi ser på) og motstående katet (overfor vinkelen).\n\nPythagoras\' setning: a² + b² = c²\nder c er hypotenusen.',
          },
          {
            id: 'l2', type: 'text', title: 'Sinus, cosinus og tangens', duration: 12, order: 1,
            content: 'Vi definerer de tre trigonometriske funksjonene for en vinkel v i en rettvinklet trekant:\n\nsin(v) = motstående katet / hypotenus\ncos(v) = hosliggende katet / hypotenus\ntan(v) = motstående katet / hosliggende katet\n\nHuskeregel: SOH-CAH-TOA\n\nEksempel: Finn siden x hvis v = 30° og hypotenus = 10.\nx = 10 · sin(30°) = 10 · 0,5 = 5',
          },
          {
            id: 'l3', type: 'text', title: 'Finde vinkler med invers trigonometri', duration: 10, order: 2,
            content: 'Hvis vi kjenner to sider og vil finne en vinkel, bruker vi invers trigonometri:\n\nv = sin⁻¹(motstående/hypotenus)\nv = cos⁻¹(hosliggende/hypotenus)\nv = tan⁻¹(motstående/hosliggende)\n\nPå kalkulatoren skrives dette som arcsin, arccos, arctan eller sin⁻¹, cos⁻¹, tan⁻¹.\n\nEksempel: sin(v) = 0,6 → v = sin⁻¹(0,6) ≈ 36,9°',
          },
        ],
      },
      {
        id: 'm2', title: 'Sinussetningen og cosinussetningen', order: 1,
        lessons: [
          {
            id: 'l4', type: 'text', title: 'Sinussetningen', duration: 11, order: 0,
            content: 'Sinussetningen gjelder for alle trekanter (ikke bare rettvinklede):\n\na/sin(A) = b/sin(B) = c/sin(C)\n\nder a, b, c er sidelengder og A, B, C er motstående vinkler.\n\nBrukes når vi kjenner: to vinkler og én side, eller to sider og en motstående vinkel.',
          },
          {
            id: 'l5', type: 'text', title: 'Cosinussetningen', duration: 13, order: 1,
            content: 'Cosinussetningen er en generalisering av Pythagoras:\n\na² = b² + c² - 2bc·cos(A)\n\nBrukes når vi kjenner: to sider og mellomliggende vinkel, eller alle tre sider (for å finne en vinkel).\n\nEksempel: b = 5, c = 7, A = 60°\na² = 25 + 49 - 2·5·7·cos(60°) = 74 - 35 = 39\na = √39 ≈ 6,24',
          },
        ],
      },
    ],
  },
  {
    title: 'Differensialregning for S1',
    description: 'Innføring i derivasjon og anvendelser. Vi dekker grenseverdier, derivasjonsregler og optimalisering slik det kreves i S1.',
    category: 'Differensialregning',
    level: 'S1',
    coverColor: '#db2777',
    teacherId: TEACHER_ID,
    students: 0,
    rating: 0,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Grenseverdier og den deriverte', order: 0,
        lessons: [
          {
            id: 'l1', type: 'text', title: 'Hva er den deriverte?', duration: 10, order: 0,
            content: 'Den deriverte f\'(x) beskriver hvor raskt en funksjon endrer seg i et punkt — altså stigningstallet til tangenten i det punktet.\n\nDefinisjon:\nf\'(x) = lim(h→0) [f(x+h) - f(x)] / h\n\nGeometrisk betyr dette: vi beregner stigningstallet til en sekant mellom to punkter, og lar avstanden mellom punktene gå mot null.',
          },
          {
            id: 'l2', type: 'text', title: 'Derivasjonsregler', duration: 14, order: 1,
            content: 'De viktigste derivasjonsreglene:\n\nKonstantregel: (c)\' = 0\nPotensregel: (xⁿ)\' = n·xⁿ⁻¹\nSumregel: (f + g)\' = f\' + g\'\nProduktregel: (f·g)\' = f\'·g + f·g\'\nKjederegel: (f(g(x)))\' = f\'(g(x))·g\'(x)\n\nEksempel: f(x) = 3x² + 2x - 5\nf\'(x) = 6x + 2',
          },
          {
            id: 'l3', type: 'text', title: 'Tangentlinja til en kurve', duration: 9, order: 2,
            content: 'Tangentlinja til f i punktet (a, f(a)) har stigningstall f\'(a).\n\nLinja skrives: y - f(a) = f\'(a)·(x - a)\n\nEksempel: f(x) = x², finn tangenten i x = 2.\nf(2) = 4, f\'(x) = 2x, f\'(2) = 4\nTangent: y - 4 = 4(x - 2) → y = 4x - 4',
          },
        ],
      },
      {
        id: 'm2', title: 'Optimalisering', order: 1,
        lessons: [
          {
            id: 'l4', type: 'text', title: 'Maksimum og minimum', duration: 11, order: 0,
            content: 'Et ekstremalpunkt er et punkt der funksjonen har lokalt maksimum eller minimum.\n\nFremgangsmåte:\n1. Finn f\'(x)\n2. Sett f\'(x) = 0 og løs for x\n3. Sjekk fortegnet til f\'(x) på begge sider (fortegnsskjema)\n4. Minuspunkt der f\' skifter fra + til - er maks, fra - til + er min\n\nAlternativt: bruk andrederiverte. f\'\'(a) < 0 → maks, f\'\'(a) > 0 → min.',
          },
          {
            id: 'l5', type: 'text', title: 'Praktiske optimaliseringsoppgaver', duration: 15, order: 1,
            content: 'Optimaliseringsoppgaver handler om å finne det beste resultatet under gitte betingelser.\n\nFremgangsmåte:\n1. La en variabel representere det vi varierer\n2. Sett opp et uttrykk for det vi vil optimere\n3. Bruk eventuelle betingelser til å skrive uttrykket med én variabel\n4. Deriver og finn ekstremalpunktet\n5. Svar med enhet og kontroller at det er maks/min\n\nEksempel: Et rektangel har omkrets 20. Hva er størst mulig areal?\nLa bredden = x. Da er høyden = 10 - x.\nA(x) = x(10 - x) = 10x - x²\nA\'(x) = 10 - 2x = 0 → x = 5\nStørst areal: 5·5 = 25',
          },
        ],
      },
    ],
  },
  {
    title: 'Funksjoner og grafer — R1',
    description: 'Dypdykk i funksjoner for R1-elever: polynomfunksjoner, rasjonale funksjoner, eksponential- og logaritmefunksjoner.',
    category: 'Funksjoner',
    level: 'R1',
    coverColor: '#2D8E6A',
    teacherId: TEACHER_ID,
    students: 0,
    rating: 0,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Polynomfunksjoner', order: 0,
        lessons: [
          {
            id: 'l1', type: 'text', title: 'Polynomfunksjoner og nullpunkter', duration: 10, order: 0,
            content: 'En polynomfunksjon er på formen:\nf(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀\n\nGraden til polynomet er den høyeste eksponenten.\n\nNullpunkter er x-verdier der f(x) = 0. Et polynom av grad n har inntil n nullpunkter.\n\nPolvisdivisjon brukes til å faktorisere polynomer og finne nullpunkter.',
          },
          {
            id: 'l2', type: 'text', title: 'Rasjonale funksjoner', duration: 12, order: 1,
            content: 'En rasjonal funksjon er en brøk av to polynomer:\nf(x) = p(x) / q(x)\n\nVertikale asymptoter: der q(x) = 0 (og p(x) ≠ 0)\nHorisontale asymptoter: avhenger av gradene\n- grad(p) < grad(q): y = 0\n- grad(p) = grad(q): y = ledende koeffisient til p / q\n- grad(p) > grad(q): ingen horisontal asymptote\n\nHusk å finne definisjonsområdet (unngå nullpunkter til nevneren).',
          },
        ],
      },
      {
        id: 'm2', title: 'Eksponential- og logaritmefunksjoner', order: 1,
        lessons: [
          {
            id: 'l3', type: 'text', title: 'Eksponentialfunksjoner', duration: 9, order: 0,
            content: 'En eksponentialfunksjon er på formen:\nf(x) = a · bˣ, der b > 0 og b ≠ 1\n\nHvis b > 1: vekst\nHvis 0 < b < 1: nedgang\n\nViktig base: e ≈ 2,718 (Eulers tall)\nf(x) = eˣ er sin egen deriverte!\n\nVekstfaktor og prosentvis vekst:\nb = 1 + r der r er vekstraten (f.eks. 0,05 = 5%)',
          },
          {
            id: 'l4', type: 'text', title: 'Logaritmefunksjoner', duration: 11, order: 1,
            content: 'Logaritmen er den inverse funksjonen til eksponentialfunksjonen:\nlog_b(x) = y ⟺ bʸ = x\n\nViktige logaritmer:\nln(x) = log_e(x)  (naturlig logaritme)\nlg(x) = log₁₀(x) (tier-logaritme)\n\nRegneregler:\nln(a·b) = ln(a) + ln(b)\nln(a/b) = ln(a) - ln(b)\nln(aʳ) = r·ln(a)\n\nDerivert: (ln x)\' = 1/x',
          },
        ],
      },
    ],
  },
  {
    title: 'Statistikk og sannsynlighet — 1P og 2P',
    description: 'Gjennomgang av deskriptiv statistikk, sannsynlighetsregning og kombinatorikk. Tilpasset 1P- og 2P-pensum.',
    category: 'Statistikk',
    level: '2P',
    coverColor: '#d97706',
    teacherId: TEACHER_ID,
    students: 0,
    rating: 0,
    published: true,
    createdAt: Timestamp.now(),
    modules: [
      {
        id: 'm1', title: 'Deskriptiv statistikk', order: 0,
        lessons: [
          {
            id: 'l1', type: 'text', title: 'Gjennomsnitt, median og typetall', duration: 8, order: 0,
            content: 'De tre vanligste sentralmålene:\n\nGjennomsnitt: summen av alle verdier delt på antallet\n x̄ = (x₁ + x₂ + ... + xₙ) / n\n\nMedian: midtverdien når datamaterialet er sortert. Ved jevnt antall verdier: gjennomsnittet av de to midterste.\n\nTypetall (modus): verdien som forekommer oftest.\n\nHvilket mål som er best avhenger av datamaterialet. Gjennomsnitt påvirkes av ekstremverdier.',
          },
          {
            id: 'l2', type: 'text', title: 'Spredning og boksplot', duration: 10, order: 1,
            content: 'Spredningsmål forteller oss hvor variert datamaterialet er.\n\nVariasjonsbredde: høyeste - laveste verdi\n\nKvartiler deler det sorterte datamaterialet i fire:\nQ1: median av nedre halvdel\nQ2: median (midtpunktet)\nQ3: median av øvre halvdel\n\nKvartilbredde: Q3 - Q1\n\nBoksplot (box plot) viser min, Q1, Q2, Q3 og maks grafisk.',
          },
        ],
      },
      {
        id: 'm2', title: 'Sannsynlighet', order: 1,
        lessons: [
          {
            id: 'l3', type: 'text', title: 'Grunnleggende sannsynlighet', duration: 9, order: 0,
            content: 'Sannsynligheten for en hendelse A er:\nP(A) = antall gunstige utfall / totalt antall mulige utfall\n\nSannsynligheten er alltid mellom 0 og 1.\nP(umulig) = 0, P(sikker) = 1\n\nKomplementregelen:\nP(A) + P(ikke A) = 1\n\nEksempel: Kast en terning. P(6) = 1/6, P(ikke 6) = 5/6',
          },
          {
            id: 'l4', type: 'text', title: 'Addisjon og multiplikasjon', duration: 12, order: 1,
            content: 'Addisjonsregelen (eller):\nP(A eller B) = P(A) + P(B) - P(A og B)\n\nHvis A og B er utelukket hverandre:\nP(A eller B) = P(A) + P(B)\n\nMultiplikasjonsregelen (og):\nP(A og B) = P(A) · P(B|A)\n\nHvis A og B er uavhengige:\nP(A og B) = P(A) · P(B)\n\nP(B|A) leses som "sannsynligheten for B gitt at A har skjedd" (betinget sannsynlighet).',
          },
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
