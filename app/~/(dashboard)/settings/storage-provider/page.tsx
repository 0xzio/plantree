'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { trpc } from '@/lib/trpc'
import { StorageProviderSettingForm } from './StorageProviderSettingForm'

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
    <div>
      <StorageProviderSettingForm site={site!} />
    </div>
  )
}
