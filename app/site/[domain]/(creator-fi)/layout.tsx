import { SpaceProvider } from '@/components/SpaceContext'
import { getSite, getSpace } from '@/lib/fetchers'
import { StoreProvider } from '@/store'
import { Toaster } from 'sonner'
import { CreatorFiLayout } from './CreatorFiLayout'

export default async function Layout({
  params,
  children,
}: {
  children: React.ReactNode
  params: { domain: string }
}) {
  const site = await getSite(params)
  if (!site?.spaceId) return null
  const space = await getSpace(site.spaceId)

  return (
    <div className="min-h-screen bg-foreground/5">
      <SpaceProvider space={space} site={site}>
        <StoreProvider>
          <Toaster className="dark:hidden" />
          <Toaster theme="dark" className="hidden dark:block" />
          <CreatorFiLayout>{children}</CreatorFiLayout>
        </StoreProvider>
      </SpaceProvider>
    </div>
  )
}
