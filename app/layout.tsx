import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
import { EditorProvider } from '@/contexts/EditorContext'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lærdom',
  description: 'Norges læringsplattform — kunnskap som inspirerer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body className="font-sans bg-bg text-ink antialiased" suppressHydrationWarning>
        <AuthProvider>
          <EditorProvider>
            <Navbar />
            {children}
          </EditorProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
