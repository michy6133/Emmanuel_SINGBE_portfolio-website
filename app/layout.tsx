import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Sora } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const sora = Sora({
  variable: '--font-clash',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://emmanuelsingbe.com'),
  title: 'Emmanuel SINGBE — Vidéaste Mobile & Créateur de Contenu',
  description:
    "Portfolio premium d'Emmanuel SINGBE, vidéaste mobile, créateur de contenu et community manager. Des vidéos qui racontent une histoire, suscitent l'émotion et génèrent de l'impact.",
  generator: 'v0.app',
  keywords: [
    'vidéaste mobile',
    'créateur de contenu',
    'community manager',
    'production vidéo',
    'Bénin',
    'Emmanuel SINGBE',
  ],
  openGraph: {
    title: 'Emmanuel SINGBE — Vidéaste Mobile & Créateur de Contenu',
    description:
      "Des vidéos qui racontent une histoire, suscitent l'émotion et génèrent de l'impact.",
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Emmanuel SINGBE',
    images: [
      {
        url: '/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'Emmanuel SINGBE, vidéaste mobile et créateur de contenu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel SINGBE — Vidéaste Mobile & Créateur de Contenu',
    description:
      "Portfolio premium d'Emmanuel SINGBE, vidéaste mobile, créateur de contenu et community manager.",
    images: ['/hero-bg.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: light)' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${sora.variable} bg-background`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
