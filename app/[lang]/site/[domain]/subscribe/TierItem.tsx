'use client'

import { useMemo } from 'react'
import { PlateEditor } from '@/components/editor/plate-editor'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Site } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { Tier } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  site: Site
  tier: Tier
}

export function TierItem({ tier, site }: Props) {
  const searchParams = useSearchParams()
  const source = searchParams?.get('source')
  const checkout = trpc.stripe.subscribeSiteCheckout.useMutation()
  const cancelSubscription = trpc.stripe.cancelSubscription.useMutation()
  const { data: session, isLoading } = useSession()
  const { setIsOpen } = useLoginDialog()
  const subscriptionRes = trpc.tier.mySubscriptionBySiteId.useQuery(
    { siteId: site.id },
    { enabled: !!session },
  )

  const loading =
    isLoading ||
    subscriptionRes.isLoading ||
    checkout.isPending ||
    cancelSubscription.isPending

  const hasMember = useMemo(() => {
    if (!subscriptionRes?.data) return false
    const subscription = subscriptionRes?.data
    if (
      subscription.sassCurrentPeriodEnd &&
      subscription.sassSubscriptionStatus === 'active'
    ) {
      return new Date(subscription.sassCurrentPeriodEnd).getTime() > Date.now()
    }
    return false
  }, [subscriptionRes?.data])

  const isMember = useMemo(() => {
    if (!subscriptionRes?.data) return false
    const subscription = subscriptionRes?.data
    if (subscription.tierId !== tier.id) return false
    if (
      !subscription.sassCurrentPeriodEnd ||
      subscription.sassSubscriptionStatus === 'canceled'
    ) {
      return false
    }
    return new Date(subscription.sassCurrentPeriodEnd).getTime() > Date.now()
  }, [subscriptionRes?.data])

  return (
    <Card className="relative flex min-h-[520px] flex-col justify-between gap-4 rounded-xl p-4 shadow-none bg-background w-[300px]">
      <div className="space-y-1">
        <div className="flex">
          <div>{tier.name}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold">${Number(tier.price)}</div>
          <div>/ month</div>
        </div>
      </div>

      <div className="flex-1 text-sm">
        <PlateEditor value={tier.description} readonly className="p-0" />
      </div>

      <div className="h-10 flex justify-center">
        {loading && <LoadingDots className="bg-foreground" />}

        {!loading && (
          <Button
            variant={isMember ? 'secondary' : 'default'}
            disabled={loading}
            className="flex items-center gap-1 w-full"
            onClick={async () => {
              if (!session) {
                return setIsOpen(true)
              }
              if (hasMember && subscriptionRes?.data?.tierId !== tier.id) {
                toast.info(
                  'Please cancel subscription before upgrading to this tier.',
                )
                return
              }

              if (isMember) {
                console.log('canceling subscription...')
                await cancelSubscription.mutateAsync({ siteId: site.id })
                await subscriptionRes.refetch()
                toast.success('Subscription canceled successfully.')
              } else {
                const res = await checkout.mutateAsync({
                  tierId: tier.id,
                  siteId: site.id,
                  priceId: tier.stripePriceId!,
                  host: window.location.host,
                  pathname: encodeURIComponent(source || '/'),
                })
                console.log('=======res:', res)
                window.location.href = res.url!
              }
            }}
          >
            {isMember && <div>Cancel subscription</div>}
            {!isMember && <div>Subscribe</div>}
            {checkout.isPending && <LoadingDots className="bg-background" />}
          </Button>
        )}
      </div>
    </Card>
  )
}
