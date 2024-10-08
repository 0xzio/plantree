import { PropsWithChildren, Suspense } from 'react'
import { getHomeSpaces } from '@/lib/fetchers'
import { LaunchButton } from './LaunchButton'
import { Slogan } from './Slogan'
import { SpaceInfoLoader } from './SpaceInfoLoader'

export default async function HomePage({ children }: PropsWithChildren) {
  const spaces = await getHomeSpaces()

  return (
    <div className="flex flex-col justify-center pt-5 md:pt-20 gap-8 relative pb-20">
      <SpaceInfoLoader spaces={spaces} />
      <Slogan></Slogan>

      {children}
    </div>
  )
}
