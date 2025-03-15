'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { getUrl } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { CampaignCard } from './CampaignCard'
import { CampaignDialog } from './CampaignDialog/CampaignDialog'
import { useCampaignDialog } from './CampaignDialog/useCampaignDialog'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, data, error } = trpc.campaign.myCampaign.useQuery()
  const { setState } = useCampaignDialog()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-[70%] flex items-center justify-center">
        <CampaignDialog />
        <div className="flex flex-col justify-between items-center gap-3">
          <div className="text-sm text-foreground/50">
            Create your campaign to get supports
          </div>
          <Button
            size="lg"
            className="flex gap-1"
            onClick={() => {
              setState({
                isOpen: true,
                campaign: null as any,
              })
            }}
          >
            <Plus size={16} />
            <span>Create campaign</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <CampaignDialog />
      <CampaignCard campaign={data} />
    </div>
  )
}
