'use client'

import { FullPageDatabase } from '@/components/database-ui'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { api, trpc } from '@/lib/trpc'
import { I18nSettingForm } from './I18nSettingForm'

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
        slug="__PENX_PROJECTS__"
        fetcher={async () => {
          return await api.database.getOrCreateProjectsDatabase.mutate({
            siteId: site.id,
          })
        }}
      />
    </div>
  )
}
