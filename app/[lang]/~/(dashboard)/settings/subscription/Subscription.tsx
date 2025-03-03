'use client'

import { useMemo } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PlanListDialog } from '@/components/PlanList/PlanListDialog'
import { usePlanListDialog } from '@/components/PlanList/usePlanListDialog'
import { useSiteContext } from '@/components/SiteContext'
import { useSubscriptionDialog } from '@/components/SubscriptionDialog/useSubscriptionDialog'
import { useSubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UseCouponCode } from '@/components/UseCouponCode'
import { api } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { toReadableTime } from '@/lib/utils'
import { BillingCycle, PlanType } from '@prisma/client'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { format } from 'date-fns'
import { useAccount } from 'wagmi'

interface Props {}

export function Subscription({}: Props) {
  const site = useSiteContext()
  const { data: session, update } = useSession()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const time = useMemo(() => {
    if (!session?.believerPeriodEnd) return null
    const now = Date.now()
    const end = new Date(session?.believerPeriodEnd!).getTime()
    return end >= now ? toReadableTime((end - now) / 1000) : ''
  }, [session])

  const planListDialog = usePlanListDialog()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">PenX</div>
          <Badge>{session?.planType || 'Free'}</Badge>

          {session?.isBeliever && <Badge variant="success">Believer</Badge>}

          {!session?.isFree && session?.isSubscription && (
            <Badge variant="secondary">{session?.billingCycle}</Badge>
          )}

          {!session?.isFree && session?.subscriptionStatus === 'canceled' && (
            <Badge variant="secondary">Canceled</Badge>
          )}
        </div>

        <div className="text-foreground/60">
          Subscribe to Penx to support us in building the best product.
        </div>

        {session?.isBeliever && (
          <div className="flex items-center gap-2">
            <div className="text-foreground/50">Plan expires at</div>
            <div className="text-lg font-semibold">
              {format(new Date(session?.believerPeriodEnd!), 'LLL do, yyyy')}
            </div>
            {time && <div className="text-foreground/50">({time})</div>}
          </div>
        )}

        <div className="space-x-2">
          <Button
            size="lg"
            onClick={() => {
              planListDialog.setIsOpen(true)
              // if (isConnected) {
              //   subscriptionDialog.setIsOpen(true)
              // } else {
              //   openConnectModal?.()
              // }
            }}
          >
            {!session?.isFree && session?.subscriptionStatus !== 'canceled'
              ? 'Change plan'
              : 'Upgrade'}
          </Button>

          {!session?.isFree &&
            session?.isSubscription &&
            session?.subscriptionStatus !== 'canceled' && (
              <ConfirmDialog
                title="Cancel subscription?"
                content="Are you sure you want to cancel subscription?"
                onConfirm={async () => {
                  await api.billing.cancel.mutate()
                  await update({
                    type: 'cancel-subscription',
                    siteId: site.id,
                  })
                }}
              >
                <Button className="text-foreground/40" variant="link">
                  Cancel subscription
                </Button>
              </ConfirmDialog>
            )}
        </div>
      </div>

      {/* <Separator className="my-6"></Separator> */}
      {/* <UseCouponCode></UseCouponCode> */}
    </div>
  )
}
