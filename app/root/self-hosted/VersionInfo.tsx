'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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

  const upgradable = compareVersions(site.version || '0.0.1', penxVersion) < 0

  return (
    <div className="flex items-center justify-center gap-1 h-4">
      <div className="text-xs opacity-40">v{site.version || '0.0.1'}</div>
      {upgradable && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="flex items-center gap1">
              <ArrowUp
                size={12}
                className="bg-green-500 rounded-full text-white cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                v{penxVersion} is available. Click redeploy to upgrade.
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {!upgradable && <span className="text-xs opacity-40">(newest)</span>}
    </div>
  )
}
