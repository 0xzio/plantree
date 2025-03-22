'use client'

import { cn } from '@/lib/utils'
import { PlanType } from '@prisma/client'
import { Check, XIcon } from 'lucide-react'
import { UpgradeButton } from './UpgradeButton'
import { useBillingCycle } from './useBillingCycle'

type Benefit = {
  ok: boolean
  text: string
}

interface Props {
  name: string
  type: PlanType
  monthlyPrice: number
  annualPrice: number
  collaboratorCount?: number
  benefits: Benefit[]
  isBeliever?: boolean
}

export function PlanItem({
  name,
  type,
  monthlyPrice,
  annualPrice,
  benefits,
  collaboratorCount,
  isBeliever,
}: Props) {
  const { isMonthly } = useBillingCycle()

  // if (isBeliever) {
  //   return (
  //     <div>
  //       <div>Everything in Pro Plan</div>
  //     </div>
  //   )
  // }
  return (
    <div className="space-y-8 bg-background/40 border-foreground/10 px-8 py-8 dark:border w-full flex flex-col border-r border-t">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-xl font-bold">{name}</div>
        {isBeliever && (
          <div className="flex items-center gap-1">
            <div className="text-3xl font-bold">$512</div>
            <div className=""> / 5 years</div>
          </div>
        )}
        {!isBeliever && (
          <div className="flex items-center gap-1">
            <div className="text-3xl font-bold">
              {isMonthly ? `$${monthlyPrice}` : `$${annualPrice}`}
            </div>
            <div className=""> / {isMonthly ? 'month' : 'year'}</div>
          </div>
        )}
      </div>
      <div className="space-y-3 flex-1">
        {benefits.map((benefit, index) => (
          <BenefitItem key={benefit.text} benefit={benefit} />
        ))}
      </div>
      <div className="text-center">
        <UpgradeButton type={type} isBeliever={isBeliever} />
      </div>
    </div>
  )
}

function BenefitItem({ benefit }: { benefit: Benefit }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {benefit.ok && <Check className="text-green-500" size={16} />}
      {!benefit.ok && <XIcon className="text-foreground/40" size={16} />}
      <div
        className={cn(
          'text-foreground/70 text-sm',
          !benefit.ok && 'line-through text-foreground/40',
        )}
      >
        {benefit.text}
      </div>
    </div>
  )
}
