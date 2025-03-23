'use client'

import { ReactNode } from 'react'
import { SiteLink } from '@/components/SiteLink'
import { Trans } from '@lingui/react/macro'
import { SettingNav } from './SettingNav'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 md:mx-auto">
      <div className="flex-col md:flex-row flex md:items-center md:justify-between gap-2 border-b border-foreground/10 h-12 sticky bg-background top-0 px-4 z-20">
        <div className="text-xl font-bold">
          <Trans>Settings</Trans>
        </div>
        <div className="hidden sm:block">
          <SiteLink />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 px-4">
        <SettingNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
