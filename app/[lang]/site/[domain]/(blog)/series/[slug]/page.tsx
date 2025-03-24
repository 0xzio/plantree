import { PageTitle } from '@/components/theme-ui/PageTitle'
import { SeriesPageWidget } from '@/components/theme-ui/SeriesPageWidget'
import { initLingui } from '@/initLingui'
import { getSeries, getSite } from '@/lib/fetchers'
import { AppearanceConfig } from '@/lib/theme.types'
import linguiConfig from '@/lingui.config'
import { Trans } from '@lingui/react/macro'
import { Metadata } from 'next'
import { SeriesInfo } from './SeriesInfo'
import { SeriesPostList } from './SeriesPostList'

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

  return (
    <div className="space-y-6  mx-auto max-w-3xl pt-20">
      <SeriesInfo series={series as any} />
      <SeriesPostList series={series as any} />
    </div>
  )
}
