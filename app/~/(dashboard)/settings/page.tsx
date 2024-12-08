'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { DeleteSiteCard } from './DeleteSiteCard'
import { DeleteSiteDialog } from './DeleteSiteDialog/DeleteSiteDialog'
import { GeneralSettingForm } from './GeneralSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <GeneralSettingForm site={site!} />
      <DeleteSiteDialog />
      <DeleteSiteCard site={site!} />
    </div>
  )
}
