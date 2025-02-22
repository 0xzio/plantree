'use client'

import { FullPageDatabase } from '@/components/database-ui'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { FRIEND_DATABASE_NAME } from '@/lib/constants'
import { api } from '@/lib/trpc'

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
        slug={FRIEND_DATABASE_NAME}
        fetcher={async () => {
          return await api.database.getOrCreateFriendsDatabase.mutate({
            siteId: site.id,
          })
        }}
      />
    </div>
  )
}
