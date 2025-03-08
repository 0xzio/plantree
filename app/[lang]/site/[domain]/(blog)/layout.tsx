import { ChatSheet } from '@/components/Chat/ChatSheet'
import { SiteProvider } from '@/components/SiteContext'
import { getSite, getTags } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

// export async function generateMetadata({ params }: any): Promise<Metadata> {
//   const site = await getSite(params)

//   const title = site?.name || ''
//   const description = site?.description || ''

//   return {
//     title,
//     description,
//     icons: [site.logo || 'https://penx.io/favicon.ico'],
//     openGraph: {
//       title,
//       description,
//     },
//   }
// }

export default async function RootLayout({
  params,
  children,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const tags = await getTags(site.id)
  const { SiteLayout } = loadTheme(site.themeName)

  const brand =
    site.themeConfig?.__COMMON__?.color || 'oklch(0.656 0.241 354.308)'
  return (
    <div
      style={
        {
          '--brand': brand,
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
