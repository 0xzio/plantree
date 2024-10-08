import { Suspense } from 'react'
import { AppDialog } from './AppDialog/AppDialog'
import { AppList } from './AppList'
import { CreateAppButton } from './CreateAppButton'

export default async function HomePage() {
  return (
    <div>
      <AppDialog />

      <div className="flex items-center justify-between mt-10 mb-6">
        <div className="text-3xl font-semibold">Applications</div>
        <Suspense fallback={''}>
          <CreateAppButton />
        </Suspense>
      </div>
      <AppList />
    </div>
  )
}
