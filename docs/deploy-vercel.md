# Deploy til Vercel

## 1. Push koden til GitHub

Gå til [github.com](https://github.com) og lag et nytt repository (kall det f.eks. `marina`).

Deretter i terminalen:

```bash
git remote add origin https://github.com/DITT-BRUKERNAVN/marina.git
git push -u origin main
```

---

## 2. Koble til Vercel

1. Gå til [vercel.com](https://vercel.com) og logg inn
2. Trykk **"Add New Project"**
3. Velg **"Import Git Repository"** og koble til GitHub-kontoen din
4. Velg `marina`-repoet
5. Vercel oppdager automatisk at det er Next.js — ikke endre noe under "Build & Output Settings"

---

## 3. Legg til miljøvariabler

`.env.local` er ikke med i Git, så du må legge inn variablene manuelt i Vercel under **"Environment Variables"**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | finn i `.env.local` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | finn i `.env.local` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | finn i `.env.local` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | finn i `.env.local` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | finn i `.env.local` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | finn i `.env.local` |

---

## 4. Deploy

Trykk **"Deploy"**. Vercel bygger og deployer — tar ca. 1–2 minutter. Du får en URL på formen `marina.vercel.app`.

---

## 5. Autoriser domenet i Firebase

Firebase Auth blokkerer innlogging fra ukjente domener. Etter deploy må du legge til Vercel-URLen:

1. Gå til [Firebase Console](https://console.firebase.google.com) → `mattementor`
2. **Authentication** → **Settings** → **Authorized domains**
3. Trykk **"Add domain"** og legg til `marina.vercel.app`

---

## Fremtidige oppdateringer

Etter dette er satt opp deployer Vercel automatisk hver gang du pusher til `main`:

```bash
git add .
git commit -m "oppdatering"
git push
```
