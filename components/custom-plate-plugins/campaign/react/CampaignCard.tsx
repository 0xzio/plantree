'use client'

import { useEffect, useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { usePathname } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'
import { getUrl } from '@/lib/utils'
import { Campaign } from '@prisma/client'
import Image from 'next/image'

export function CampaignCard({ campaignId }: { campaignId: string }) {
  const { data, isLoading } = trpc.campaign.byId.useQuery(campaignId)
  const [loading, setLoading] = useState(false)
  const checkout = trpc.stripe.buyProductCheckout.useMutation()
  const pathname = usePathname()
  const site = useSiteContext()

  if (isLoading) {
    return (
      <div className="border border-foreground/10 p-8 rounded-2xl flex flex-col gap-4 w-full sm:w-[500px] min-h-[310px] relative">
        <div className="flex items-center gap-2">
          <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
          <div className="space-y-1 w-full">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>

          <Skeleton className="h-3" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="w-full flex-col items-end justify-end mt-auto">
          <Skeleton className="h-13" />
        </div>
      </div>
    )
  }

  return <CampaignCardContent campaign={data!} />
}

export function CampaignCardContent({ campaign }: { campaign: Campaign }) {
  const [progress, setProgress] = useState(0)

  const percent = (100 * campaign.currentAmount) / campaign.goal
  // const percent = 40

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percent)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="border border-foreground/10 p-8 rounded-2xl flex flex-col gap-4 w-full sm:w-[500px] min-h-[310px] relative">
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
            <strong className="text-lg">{campaign.backerCount}</strong> backers
          </div>
        </div>
        <Progress value={progress} className="h-3" />

        <div>
          {percent}% towards{' '}
          <strong className="">${campaign.goal / 100}</strong> goal
        </div>
      </div>
      <div className="w-full flex-col items-end justify-end mt-auto">
        <Button className="w-full" size="xl">
          Support this project
        </Button>
      </div>
    </div>
  )
}
