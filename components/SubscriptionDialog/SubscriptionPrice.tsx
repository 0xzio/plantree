'use client'

import { precision } from '@/lib/math'
import { ExternalLink } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { usePlans } from './usePlans'

interface Props {}

export function SubscriptionPrice({}: Props) {
  const { isLoading, getPlanPrice } = usePlans()

  if (isLoading) return <Skeleton className="h-10"></Skeleton>

  return (
    <div className="flex items-center justify-between h-10">
      <div>
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold">
            {precision.toDecimal(getPlanPrice())} $PEN
          </div>
          <div className=""> / month</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-foreground/50">
          <div className="">≃ 5 USD</div>
        </div>
      </div>

      <a
        href={process.env.NEXT_PUBLIC_HOW_TO_GET_PEN_URL}
        target="_blank"
        className="text-brand-500 text-sm flex items-center gap-1"
      >
        <span>How to get $PEN?</span>
        <ExternalLink size={12}></ExternalLink>
      </a>
    </div>
  )
}
