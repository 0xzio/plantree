'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { compareVersions } from '@/lib/compareVersions'
import { trpc } from '@/lib/trpc'
import { HostedSite } from '@prisma/client'
import { ArrowUp } from 'lucide-react'

export function VersionInfo({ site }: { site: HostedSite }) {
  const { data: penxVersion = '', isLoading } =
    trpc.hostedSite.penxVersion.useQuery()

  if (isLoading) {
    return <Skeleton className="h-4 w-20" />
  }

  const upgradable =
    site.version && compareVersions(site.version, penxVersion) < 0

  return (
    <div className="flex items-center justify-center gap-1 h-4">
      <div className="text-xs opacity-40">v{site.version || '0.0.1'}</div>
      {upgradable && (
        <ArrowUp size={12} className="bg-green-500 rounded-full text-white" />
      )}

      {!upgradable && <span className="text-xs opacity-40">(newest)</span>}
    </div>
  )
}
