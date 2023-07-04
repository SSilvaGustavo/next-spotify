import { SessionProvider } from '@/components/SessionProvider'
import './globals.css'
import { Inter } from 'next/font/google'
import { Figtree } from 'next/font/google'
import { RecoilProvider } from '@/components/RecoilRoot'

// const inter = Inter({ subsets: ['latin'] })
const figtree = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Spotify 2.0',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {;
  return (
    <html lang="en">
      <body className={figtree.className}>
        <SessionProvider>
          <RecoilProvider>
            {children}
          </RecoilProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
