import { SiteProvider } from '@/components/SiteContext'
import { initLingui } from '@/initLingui'
import { getSite } from '@/lib/fetchers'
import { AppearanceConfig } from '@/lib/theme.types'
import linguiConfig from '@/lingui.config'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { GoogleAnalytics } from 'nextjs-google-analytics'

type Params = Promise<{ domain: string; lang: string }>

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

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
}: {
  children: React.ReactNode
  params: Params
}) {
  const site = await getSite(await params)
  const lang = (await params).lang
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang
  // console.log('=====locale:', locale, 'lang:', lang)

  initLingui(locale)

  return (
    <SiteProvider site={site as any}>
      {children}

      {site.analytics?.umamiHost && site.analytics?.umamiWebsiteId && (
        <script
          async
          defer
          src={
            `${site.analytics.umamiHost}/script.js` || 'https://cloud.umami.is'
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
  )
}
