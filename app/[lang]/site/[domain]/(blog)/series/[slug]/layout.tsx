import { ChatSheet } from '@/components/Chat/ChatSheet'
import { SeriesProvider } from '@/components/SeriesContext'
import { SiteProvider } from '@/components/SiteContext'
import { Footer } from '@/components/theme-ui/Footer'
import { initLingui } from '@/initLingui'
import { getSeries, getSite, getTags } from '@/lib/fetchers'
import { redirectTo404 } from '@/lib/redirectTo404'
import { AppearanceConfig } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import linguiConfig from '@/lingui.config'
import { SeriesType } from '@prisma/client'
import { Metadata } from 'next'
import { Header as BookHeader } from './book/Header'
import { Sidebar } from './book/Sidebar'
import { Header as ColumnHeader } from './column/Header'
import { SeriesInfo } from './column/SeriesInfo'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string; slug: string }>
}) {
  const params = await props.params
  const site = await getSite(params)
  if (!site) return redirectTo404()

  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const brand = appearance?.color || 'oklch(0.656 0.241 354.308)'
  const baseFont = appearance?.baseFont

  let font = 'font-sans'
  if (baseFont === 'serif') font = 'font-serif'
  if (baseFont === 'sans') font = 'font-sans'
  if (baseFont === 'mono') font = 'font-mono'

  const series = await getSeries(site.id, params.slug)

  return (
    <div
      className={cn('min-h-screen flex flex-col', font)}
      style={
        {
          '--brand': brand,
          '--primary': brand,
        } as any
      }
    >
      <SiteProvider site={site as any}>
        {series?.seriesType === SeriesType.BOOK && (
          <SeriesProvider series={series as any}>
            <div>
              <BookHeader site={site} series={series as any} />
              <main className="flex flex-1 w-full px-4 xl:px-0 gap-x-16 relative max-w-7xl mx-auto">
                <Sidebar
                  series={series as any}
                  site={site}
                  className="hidden md:block"
                />
                <div className="flex-1">{props.children}</div>
              </main>
            </div>
          </SeriesProvider>
        )}

        {series?.seriesType === SeriesType.COLUMN && (
          <>
            <div className="flex-1 flex flex-col gap-6 h-full">
              <ColumnHeader site={site} />
              <SeriesInfo series={series as any} />
              <div className="mx-auto max-w-3xl mt-10 flex-1">
                {props.children}
              </div>
              <Footer site={site} className="mt-auto" />
            </div>
          </>
        )}
      </SiteProvider>
    </div>
  )
}
