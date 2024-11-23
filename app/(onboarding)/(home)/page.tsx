import { Suspense } from 'react'
import { LaunchButton } from './LaunchButton'
import { SiteList } from './SiteList'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default async function HomePage() {
  return (
    <div>
      <div className="flex items-center justify-between mt-10 mb-6">
        <div className="text-2xl font-semibold">Sites</div>
        {/* <Suspense fallback={''}>
          <LaunchButton />
        </Suspense> */}
      </div>
      <SiteList />
    </div>
  )
}
