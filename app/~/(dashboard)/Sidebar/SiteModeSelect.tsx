'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSite } from '@/hooks/useSite'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { SiteMode } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export function SiteModeSelect() {
  const { site } = useSite()
  const { data } = useSession()
  if (!site) return null
  return (
    <ToggleGroup
      className="h-11 gap-3 rounded-lg bg-accent p-1 text-foreground/80"
      defaultValue={site.mode}
      onValueChange={async (v) => {
        queryClient.setQueriesData(
          {
            queryKey: ['site', data?.domain.domain],
          },
          { ...site, mode: v as any },
        )
        toast.success('Site write mode updated')
        await api.site.updateSite.mutate({
          id: site.id,
          mode: v as any,
        })
      }}
      type="single"
    >
      <ToggleGroupItem
        className="h-full flex-1 bg-accent text-xs ring-foreground data-[state=on]:bg-background"
        value={SiteMode.BASIC}
      >
        Basic
      </ToggleGroupItem>

      <ToggleGroupItem
        value={SiteMode.NOTE_TAKING}
        className="h-full flex-1 bg-accent text-xs ring-foreground data-[state=on]:bg-background"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="flex items-center gap1">
              <div>Advanced</div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">Note-Taking mode (in beta)</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
