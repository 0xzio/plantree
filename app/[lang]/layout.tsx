import '../globals.css'
import '@farcaster/auth-kit/styles.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import '@glideapps/glide-data-grid/dist/index.css'
import { LinguiClientProvider } from '@/components/LinguiClientProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { initLingui } from '@/initLingui'
import { cn } from '@/lib/utils'
import linguiConfig from '@/lingui.config'
// import { setI18n } from '@lingui/react/server'
import { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import Head from 'next/head'
import { headers } from 'next/headers'
import { allMessages, getI18nInstance } from '../../appRouterI18n'
import { Providers } from './providers'

const roboto = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'PenX'
const description = 'Modern blogging tools'

// const image = 'https://vercel.pub/thumbnail.png'

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export const metadata: Metadata = {
  title,
  description,

  icons: ['https://penx.io/favicon.ico'],
  openGraph: {
    title,
    description,
    // images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    // images: [image],
    creator: '@penx',
  },
  metadataBase: new URL('https://penx.io'),
}

export default async function RootLayout({
  params,
  children,
  ...rest
}: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const lang = (await params).lang
  const locale = lang === 'pseudo' ? 'en' : lang
  initLingui(locale)

  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background antialiased font-sans')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LinguiClientProvider
            initialLocale={locale}
            initialMessages={allMessages[locale]!}
          >
            <Providers cookies={cookies}>
              {children}
              <div id="portal" />
            </Providers>
          </LinguiClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
