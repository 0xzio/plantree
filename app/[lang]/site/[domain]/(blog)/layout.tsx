import { ChatSheet } from '@/components/Chat/ChatSheet'
import { SiteProvider } from '@/components/SiteContext'
import { initLingui } from '@/initLingui'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getSite, getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { redirectTo404 } from '@/lib/redirectTo404'
import { AppearanceConfig } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import linguiConfig from '@/lingui.config'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function RootLayout({
  params,
  children,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const site = await getSite(await params)
  if (!site) return redirectTo404()

  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = (await params).lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const tags = await getTags(site.id)
  const { SiteLayout } = loadTheme(site.themeName)
  const brand = appearance?.color || 'oklch(0.656 0.241 354.308)'
  const baseFont = appearance?.baseFont

  let font = 'font-sans'
  if (baseFont === 'serif') font = 'font-serif'
  if (baseFont === 'sans') font = 'font-sans'
  if (baseFont === 'mono') font = 'font-mono'

  return (
    <div
      className={cn(font)}
      style={
        {
          '--brand': brand,
          '--primary': brand,
        } as any
      }
    >
      <SiteLayout site={site} tags={tags}>
        <SiteProvider site={site as any}>
          {children}
          {site.spaceId && <ChatSheet />}
        </SiteProvider>
      </SiteLayout>
    </div>
  )
}
