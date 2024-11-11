import { Suspense } from 'react'
import { UserAvatar } from '@/components/UserAvatar'
import { getHomeSpaces } from '@/lib/fetchers'
import { precision } from '@/lib/math'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LaunchButton } from './LaunchButton'
import { SpaceList } from './SpaceList'
import { SpaceLogo } from './SpaceLogo'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default async function HomePage() {
  // const spaces = await getHomeSpaces()

  return (
    <div>
      <div className="flex items-center justify-between mt-10 mb-6">
        <div className="text-2xl font-semibold">Sites</div>
        <Suspense fallback={''}>
          <LaunchButton />
        </Suspense>
      </div>

      <SpaceList />
    </div>
  )
}
