'use client'

import { useEffect, useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getUrl } from '@/lib/utils'
import { Campaign } from '@prisma/client'
import { PenIcon, Plus } from 'lucide-react'
import Image from 'next/image'
import { CampaignDialog } from './CampaignDialog/CampaignDialog'
import { useCampaignDialog } from './CampaignDialog/useCampaignDialog'

interface Props {
  campaign: Campaign
}

export function CampaignCard({ campaign }: Props) {
  const [progress, setProgress] = useState(0)
  const { setState } = useCampaignDialog()

  const percent = (100 * campaign.currentAmount) / campaign.goal
  // const percent = 40

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percent)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid gap-4 relative">
      <CampaignDialog />
      <div className="border border-foreground/10 p-8 rounded-2xl flex flex-col gap-4 max-w-[500px] relative">
        <div className="flex items-center justify-between">
          <div>ID: {campaign.id}</div>
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={() => {
              setState({
                isOpen: true,
                campaign,
              })
            }}
          >
            <PenIcon size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {campaign.image && (
            <Image
              width={64}
              height={64}
              src={getUrl(campaign.image || '')}
              alt=""
              className="rounded-xl"
            />
          )}
          <div>
            <div className="flex items-center gap-1 text-foreground">
              <div className="text-2xl font-bold">{campaign.name}</div>
            </div>
            <div className="text-foreground/60">{campaign.description}</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-2xl">
                ${campaign.currentAmount / 100}
              </strong>
              <span className="text-base ml-1 text-foreground/60">
                USD raised
              </span>
            </div>
            <div>
              <strong className="text-lg">{campaign.backerCount}</strong>{' '}
              backers
            </div>
          </div>
          <Progress value={progress} className="h-3" />

          <div>
            {percent}% towards{' '}
            <strong className="">${campaign.goal / 100}</strong> goal
          </div>
        </div>
        <Button size="xl">Support this project</Button>
      </div>
    </div>
  )
}
