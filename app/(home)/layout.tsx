import { PropsWithChildren, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { getHomeSpaces } from '@/lib/fetchers'
import { LaunchButton } from './LaunchButton'
import { Slogan } from './Slogan'
import { SpaceInfoLoader } from './SpaceInfoLoader'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default async function HomePage({ children }: PropsWithChildren) {
  const spaces = await getHomeSpaces()

  return (
    <div className="flex flex-col justify-center pt-5 md:pt-20 gap-8 relative pb-20">
      <SpaceInfoLoader spaces={spaces} />

      <Slogan></Slogan>
      <div className="flex items-center justify-center gap2">
        <Button size="lg" className="h-12 text-base">
          Deploy a blog for free
        </Button>
      </div>

      {children}
    </div>
  )
}
