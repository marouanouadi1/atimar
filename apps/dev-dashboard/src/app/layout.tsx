import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Atimar Dev Dashboard',
  description: 'Superadmin dashboard — internal use only',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="it"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',s?s==='dark':true)})()`,
          }}
        />
      </head>
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
