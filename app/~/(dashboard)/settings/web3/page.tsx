'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { Web3SettingForm } from './Web3SettingForm'

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
      <Web3SettingForm site={site!} />
    </div>
  )
}
