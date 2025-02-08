import { ChatSheet } from '@/components/Chat/ChatSheet'
import { SiteProvider } from '@/components/SiteContext'
import { getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function RootLayout({
  params,
  children,
}: {
  children: React.ReactNode
  params: { domain: string }
}) {
  const site = await getSite(params)
  const { SiteLayout } = loadTheme(site.themeName)

  return (
    <SiteLayout site={site}>
      <SiteProvider site={site as any}>
        {children}
        {site.spaceId && <ChatSheet />}
      </SiteProvider>
    </SiteLayout>
  )
}
