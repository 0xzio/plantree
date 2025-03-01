'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { CommandPanel } from '@/components/CommandPanel/CommandPanel'
import { CreationDialog } from '@/components/CreationDialog/CreationDialog'
import { LoadingDots } from '@/components/icons/loading-dots'
import { PlanListDialog } from '@/components/PlanList/PlanListDialog'
import { SiteProvider } from '@/components/SiteContext'
import { SubscriptionDialog } from '@/components/SubscriptionDialog/SubscriptionDialog'
import { SubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/SubscriptionGuideDialog'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { useMySites } from '@/hooks/useMySites'
import { useSite } from '@/hooks/useSite'
import { isBrowser, isServer, SIDEBAR_WIDTH } from '@/lib/constants'
import { useSession } from '@/lib/useSession'
import { cn } from '@/lib/utils'
import { runWorker } from '@/lib/worker'
import { injectGlobalStyle, setConfig } from '@fower/react'
import { Site } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { get } from 'idb-keyval'
import { usePathname, useSearchParams } from 'next/navigation'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar/Sidebar'
import { SidebarSheet } from './Sidebar/SidebarSheet'

let inited = false
if (!isServer) {
  setTimeout(() => {
    if (inited) return
    inited = true
    runWorker()
  }, 2000)
}

setConfig({
  inline: false,
  prefix: 'penx-',
})

export function DashboardLayout({ children }: { children: ReactNode }) {
  useQueryEthPrice()
  useQueryEthBalance()
  const { data: session } = useSession()
  const { data: sites = [] } = useMySites()

  const { data: site, isLoading } = useQuery({
    queryKey: ['current_site'],
    queryFn: async () => {
      window.__SITE_ID__ = session?.activeSiteId || ''
      const site = sites.find((s) => s.id === session?.activeSiteId)
      return site || sites[0]
    },
    enabled: !!session && sites.length > 0,
  })

  const pathname = usePathname()!
  const isPost = pathname?.includes('/~/post/')
  const isAssets = pathname?.includes('/~/assets')
  const isSettings = pathname?.includes('/~/settings')
  const params = useSearchParams()!
  const isFullWidth = isPost || isAssets || isSettings || !!params.get('id')

  if (!site || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingDots className="bg-foreground/60"></LoadingDots>
      </div>
    )
  }

  return (
    <SiteProvider site={site as any}>
      <div className="h-screen flex fixed top-0 left-0 bottom-0 right-0">
        <SidebarSheet />
        <Navbar></Navbar>
        <CommandPanel />
        <SubscriptionGuideDialog />
        <SubscriptionDialog />
        <PlanListDialog />
        <div
          className={cn('h-screen sticky top-0 hidden md:flex')}
          style={{ width: SIDEBAR_WIDTH }}
        >
          <Sidebar />
        </div>
        <div className="flex-1 pb-40 h-screen overflow-auto">
          {/* <NavbarWrapper /> */}
          <CreationDialog />
          <div
            className={cn(
              !isFullWidth && 'mx-auto px-4 md:px-0 md:max-w-3xl pt-16 pb-20',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </SiteProvider>
  )
}
