import { getSite } from '@/lib/fetchers'
import { Metadata } from 'next'
import { GoogleAnalytics } from 'nextjs-google-analytics'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const site = await getSite(params)

  const title = site?.name || ''
  const description = site?.description || ''

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

export default async function RootLayout({
  params,
  children,
}: {
  children: React.ReactNode
  params: { domain: string }
}) {
  const site = await getSite(params)

  return (
    <>
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
    </>
  )
}
