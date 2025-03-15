'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { isAllowCampaign } from '@/lib/isAllowCampaign'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { getUrl } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { CampaignCard } from './CampaignCard'
import { CampaignDialog } from './CampaignDialog/CampaignDialog'
import { useCampaignDialog } from './CampaignDialog/useCampaignDialog'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, data, error } = trpc.campaign.myCampaign.useQuery()
  const { setState } = useCampaignDialog()
  const { session } = useSession()

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
          <div className="font-bold">Create your campaign to get funds</div>
          <div className="text-sm text-foreground/50 max-w-[60%] text-center">
            this feature is on beta now, and only available for specific users.
            Join our discord to contact and get access.
          </div>
          <Button
            size="lg"
            className="flex gap-1"
            onClick={() => {
              if (!isAllowCampaign(session?.userId)) {
                return toast.info(
                  'This feature is on beta now, and only available for specific users. Join our discord to contact and get access.',
                )
              }
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
