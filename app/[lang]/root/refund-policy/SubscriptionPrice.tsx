'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { precision } from '@/lib/math'
import { ExternalLink } from 'lucide-react'
import { usePlans } from './usePlans'

interface Props {}

export function SubscriptionPrice({}: Props) {
  const { isLoading, getPlanPrice } = usePlans()

  if (isLoading) return <Skeleton className="h-10"></Skeleton>

  return (
    <div className="flex items-center justify-center h-10 gap-1">
      <div className="flex items-center gap-1">
        <div className="text-2xl font-bold">
          {precision.toDecimal(getPlanPrice())} $PEN
        </div>
        <div className=""> / month</div>
      </div>
      <div className="flex items-center gap-1 text-sm text-foreground/50">
        <div className="">≃ 5 USD</div>
      </div>
    </div>
  )
}
