'use client'

import { useMemo } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PlanListDialog } from '@/components/PlanList/PlanListDialog'
import { usePlanListDialog } from '@/components/PlanList/usePlanListDialog'
import { useSubscriptionDialog } from '@/components/SubscriptionDialog/useSubscriptionDialog'
import { useSubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UseCouponCode } from '@/components/UseCouponCode'
import { useIsMember } from '@/hooks/useIsMember'
import { api } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { toReadableTime } from '@/lib/utils'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { format } from 'date-fns'
import { useAccount } from 'wagmi'

interface Props {}

export function Subscription({}: Props) {
  const { setIsOpen } = useSubscriptionGuideDialog()
  const { data: session } = useSession()
  const isMember = useIsMember()
  const subscriptionDialog = useSubscriptionDialog()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const time = useMemo(() => {
    if (!session?.subscriptionEndedAt) return null
    const now = Date.now()
    const end = new Date(session?.subscriptionEndedAt!).getTime()
    return end >= now ? toReadableTime((end - now) / 1000) : ''
  }, [session])

  const planListDialog = usePlanListDialog()
  return (
    <>
      <PlanListDialog />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {' '}
            <div className="text-2xl font-bold">PenX Pro</div>
          </div>

          <div className="text-foreground/60">
            Subscribe to Penx to support us in building the best product.
          </div>

          {/* {isMember && (
            <div className="flex items-center gap-2">
              <div className="text-foreground/50">Plan expires at</div>
              <div className="text-lg font-semibold">
                {format(
                  new Date(session?.subscriptionEndedAt!),
                  'LLL do, yyyy',
                )}
              </div>
              {time && <div className="text-foreground/50">({time})</div>}
            </div>
          )} */}

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
              {isMember ? 'Change plan' : 'Upgrade'}
            </Button>

            <ConfirmDialog
              title="Cancel subscription?"
              content="Are you sure you want to cancel subscription?"
              onConfirm={async () => {
                await api.billing.cancel.mutate()
              }}
            >
              <Button className="text-foreground/40" variant="link">
                Cancel subscription
              </Button>
            </ConfirmDialog>
          </div>
        </div>

        <Separator className="my-6"></Separator>

        <UseCouponCode></UseCouponCode>
      </div>
    </>
  )
}
