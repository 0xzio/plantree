'use client'

import { StripeType } from '@prisma/client'
import { MembershipTiers } from './MembershipTiers'
import { Payout } from './Payout'

export function PlatformStrip() {
  return (
    <div className="space-y-8 max-w-2xl">
      <MembershipTiers type={StripeType.PLATFORM} />
      <Payout />
    </div>
  )
}
