'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { ConnectStripe } from './ConnectStripe'
import { MembershipTiers } from './MembershipTiers'

export function Payment() {
  const { data, isLoading } = trpc.stripe.authInfo.useQuery()
  const tiers = trpc.tier.listSiteTiers.useQuery()

  if (isLoading || tiers.isLoading) {
    return (
      <div>
        <LoadingDots className="bg-background" />
      </div>
    )
  }

  if (!data?.account) return <ConnectStripe />

  return <MembershipTiers />
}
