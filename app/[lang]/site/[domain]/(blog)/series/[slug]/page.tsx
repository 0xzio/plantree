import { SeriesProvider } from '@/components/SeriesContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Footer } from '@/components/theme-ui/Footer'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { initLingui } from '@/initLingui'
import { editorDefaultValue } from '@/lib/constants'
import { getSeries, getSite } from '@/lib/fetchers'
import { AppearanceConfig } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import linguiConfig from '@/lingui.config'
import { Trans } from '@lingui/react/macro'
import { SeriesType } from '@prisma/client'
import { Metadata } from 'next'
import { Header } from './book/Header'
import { Sidebar } from './book/Sidebar'
import { Toc } from './book/Toc'
import { SeriesInfo } from './column/SeriesInfo'
import { SeriesPostList } from './column/SeriesPostList'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Series | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export default async function Page(props: {
  params: Promise<{ domain: string; lang: string; slug: string }>
}) {
  const params = await props.params
  const site = await getSite(params)

  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const series = await getSeries(site.id, params.slug)

  if (series?.seriesType === SeriesType.COLUMN) {
    return <SeriesPostList series={series as any} />
  }

  return (
    <div className="flex gap-x-16 pt-4 h-full">
      <div className={cn('flex-1 flex flex-col')}>
        <div className="mb-auto flex-1">
          <header className="space-y-4 pb-4">
            <div className="mb-4">
              <PageTitle className="mb-2 mt-4">
                <Trans>About</Trans>
              </PageTitle>
            </div>
          </header>
          <div className="pt-2 md:pt-4">
            <div className="">
              <ContentRender
                content={
                  series?.about ? JSON.parse(series.about) : editorDefaultValue
                }
              />
            </div>
          </div>
        </div>
        <Footer className="mt-auto" site={site} />
      </div>
      <Toc
        content={series?.about ? JSON.parse(series.about) : editorDefaultValue}
      ></Toc>
    </div>
  )
}
