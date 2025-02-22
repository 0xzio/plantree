'use client'

import { FullPageDatabase } from '@/components/database-ui'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { PROJECT_DATABASE_NAME } from '@/lib/constants'
import { api, trpc } from '@/lib/trpc'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }
  return (
    <div>
      <FullPageDatabase
        slug={PROJECT_DATABASE_NAME}
        fetcher={async () => {
          return await api.database.getOrCreateProjectsDatabase.mutate({
            siteId: site.id,
          })
        }}
      />
    </div>
  )
}
