import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { cn } from '@/lib/utils'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Atimar Dev Dashboard',
  description: 'Superadmin dashboard — internal use only',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value ?? 'dark'

  return (
    <html
      lang="it"
      className={theme}
      suppressHydrationWarning
    >
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          geistSans.variable,
          geistMono.variable,
          'font-sans'
        )}
      >
        {children}
      </body>
    </html>
  )
}
