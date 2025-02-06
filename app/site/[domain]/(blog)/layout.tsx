import { Airdrop } from '@/components/Airdrop/Airdrop'
import { ChatSheet } from '@/components/Chat/ChatSheet'
import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
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
    <SiteLayout
      site={site}
      Logo={null}
      ModeToggle={ModeToggle}
      MobileNav={null}
      ConnectButton={Profile}
      Airdrop={Airdrop}
    >
      <SiteProvider site={site as any}>
        {children}
        <ChatSheet />
      </SiteProvider>
    </SiteLayout>
  )
}
