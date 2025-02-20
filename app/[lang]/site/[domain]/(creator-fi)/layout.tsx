import { SpaceProvider } from '@/components/SpaceContext'
import { getSite, getSpace } from '@/lib/fetchers'
import { CreatorFiLayout } from './CreatorFiLayout'

export default async function Layout({
  params,
  children,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  if (!site?.spaceId) return null
  const space = await getSpace(site.spaceId)

  return (
    <div className="min-h-screen bg-foreground/5">
      <SpaceProvider space={space} site={site}>
        <CreatorFiLayout>{children}</CreatorFiLayout>
      </SpaceProvider>
    </div>
  )
}
