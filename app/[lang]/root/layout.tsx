import '../../globals.css'
// import '@farcaster/auth-kit/styles.css'
import 'shikwasa/dist/style.css'
import '@rainbow-me/rainbowkit/styles.css'
// import 'react-datepicker/dist/react-datepicker.css'
import { Link } from '@/lib/i18n'
import '@glideapps/glide-data-grid/dist/index.css'
import { allMessages } from '@/appRouterI18n'
import { LinguiClientProvider } from '@/components/LinguiClientProvider'
import { Logo } from '@/components/Logo'
import { Profile } from '@/components/Profile/Profile'
import { TextLogo } from '@/components/TextLogo'
import { ThemeProvider } from '@/components/ThemeProvider'
import { initLingui } from '@/initLingui'
import { cn } from '@/lib/utils'
import linguiConfig from '@/lingui.config'
// import { setI18n } from '@lingui/react/server'
import { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import Head from 'next/head'
import { headers } from 'next/headers'
import { Providers } from '../providers'
import { Footer } from './Footer'
import { Nav } from './Nav'

const roboto = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'Plantree - build your own Digital Garden'

const description =
  'Plantree is a tool for building a digital garden. Having your own garden, start planting, and watch it grow.'

const image = 'https://plantree.xyz/opengraph-image'

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export const metadata: Metadata = {
  title,
  description,
  icons: ['https://plantree.xyz/favicon.ico'],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
    creator: '@zio_penx',
  },
  metadataBase: new URL('https://plantree.xyz'),
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
        <LinguiClientProvider
          initialLocale={locale}
          initialMessages={allMessages[locale]!}
        >
          <Providers cookies={cookies}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col gap-4 px-2 min-h-screen container 2xl:max-w-[1120px] mx-auto">
                <div className="z-10 h-14 py-3 relative flex justify-between">
                  <div className="flex items-center gap-8">
                    <Link href="/" className="cursor-pointer flex items-center">
                      {/* <Logo className="size-5" /> */}
                      <TextLogo />
                    </Link>
                  </div>

                  <Nav />

                  <div className="flex items-center gap-2">
                    <Profile />
                  </div>
                </div>

                <div className="relative flex-1 flex flex-col">
                  <div className="z-10 relative h-full flex-1 flex flex-col">
                    {children}
                  </div>
                  <div
                    className="fixed left-[30%] top-[400px] -z-10 w-[800px] h-[800px] opacity-30 dark:opacity-0"
                    style={{
                      filter: 'blur(150px) saturate(150%)',
                      transform: 'translateZ(0)',
                      backgroundImage:
                        'radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)',
                    }}
                  ></div>
                </div>
                <Footer />
              </div>
              {process.env.NEXT_PUBLIC_UMAMIC_WEBSITE_ID && (
                <script
                  async
                  defer
                  src="https://stats.plantree.xyz/script.js"
                  data-website-id={process.env.NEXT_PUBLIC_UMAMIC_WEBSITE_ID}
                ></script>
              )}
            </ThemeProvider>

            <div id="portal" />
          </Providers>
        </LinguiClientProvider>
      </body>
    </html>
  )
}
