import '../../../globals.css'
// import '@farcaster/auth-kit/styles.css'
import 'shikwasa/dist/style.css'
// import '@rainbow-me/rainbowkit/styles.css'
// import 'react-datepicker/dist/react-datepicker.css'
// import '@glideapps/glide-data-grid/dist/index.css'
import { allMessages } from '@/appRouterI18n'
import { LinguiClientProvider } from '@/components/LinguiClientProvider'
import { SiteProvider } from '@/components/SiteContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { initLingui } from '@/initLingui'
import { getSite } from '@/lib/fetchers'
import { AppearanceConfig } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import linguiConfig from '@/lingui.config'
// import { setI18n } from '@lingui/react/server'
import { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import Head from 'next/head'
import { headers } from 'next/headers'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { Providers } from '../../providers'

type Params = Promise<{ domain: string; lang: string }>

const roboto = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const site = await getSite(await params)

  const title = site.seoTitle
  const description = site.seoDescription

  return {
    title,
    description,
    icons: [site.logo || 'https://penx.io/favicon.ico'],
    openGraph: {
      title,
      description,
    },
  }
}

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function RootLayout({
  params,
  children,
  ...rest
}: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const site = await getSite(await params)
  const lang = (await params).lang
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

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
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SiteProvider site={site as any}>
                {children}
                {site.analytics?.umamiHost &&
                  site.analytics?.umamiWebsiteId && (
                    <script
                      async
                      defer
                      src={
                        `${site.analytics.umamiHost}/script.js` ||
                        'https://cloud.umami.is'
                      }
                      data-website-id={site.analytics.umamiWebsiteId}
                    ></script>
                  )}

                {site.analytics?.gaMeasurementId && (
                  <GoogleAnalytics
                    trackPageViews
                    gaMeasurementId={site.analytics?.gaMeasurementId}
                  />
                )}
              </SiteProvider>
            </ThemeProvider>

            <div id="portal" />
          </Providers>
        </LinguiClientProvider>
      </body>
    </html>
  )
}
