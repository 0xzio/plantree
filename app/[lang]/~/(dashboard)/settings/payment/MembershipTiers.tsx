'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { editorDefaultValue } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { StripeType } from '@prisma/client'
import { Edit, Plus } from 'lucide-react'
import { TierDialog } from './TierDialog/TierDialog'
import { useTierDialog } from './TierDialog/useTierDialog'

interface Props {
  type: StripeType
}
export function MembershipTiers({ type }: Props) {
  const [loading, setLoading] = useState(false)
  const site = useSiteContext()
  const tierDialog = useTierDialog()
  const {
    data: tiers = [],
    isLoading,
    isFetching,
  } = trpc.tier.listSiteTiers.useQuery()

  const loadingTiers = isLoading || isFetching

  return (
    <div className="space-y-3">
      <TierDialog />
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold">Paid membership settings</div>
        <Badge>
          {site.stripeType === StripeType.OWN ? 'Own stripe' : 'PenX stripe'}
        </Badge>
      </div>
      <div className="space-y-2">
        {loadingTiers && <LoadingDots className="bg-foreground" />}
        {!loadingTiers &&
          tiers.map((item) => (
            <div
              key={item.id}
              className="space-y-1 border border-foreground/5 rounded-2xl p-4 max-w-[360px]"
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{item.name}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    tierDialog.setState({
                      isOpen: true,
                      tier: item,
                    })
                  }}
                >
                  <Edit size={18} />
                </Button>
              </div>
              <div>${Number(item.price)} / month</div>
              <ContentRender content={item.description || editorDefaultValue} />
            </div>
          ))}
      </div>
      {/* <Button
        variant="secondary"
        className="gap-2 flex"
        disabled={loading}
        onClick={() => {
          tierDialog.setIsOpen(true)
        }}
      >
        {loading && <LoadingDots className="bg-foreground" />}
        {!loading && (
          <>
            <Plus size={16} />
            <div className="">Add a tier</div>
          </>
        )}
      </Button> */}
    </div>
  )
}
