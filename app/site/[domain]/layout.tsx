import { getSite } from '@/lib/fetchers'
import { Metadata } from 'next'

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
  return <>{children}</>
}
