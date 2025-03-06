'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/queryClient'
import { trpc } from '@/lib/trpc'
import { StripeType } from '@prisma/client'
import { toast } from 'sonner'
import { ConnectStripe } from './ConnectStripe'
import { MembershipTiers } from './MembershipTiers'
import { StripeTypeSelect } from './StripeTypeSelect'

export function PlatformStrip() {
  return (
    <div>
      <MembershipTiers type={StripeType.PLATFORM} />
    </div>
  )
}
