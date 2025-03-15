'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { BillingCycle } from '@prisma/client'
import { Badge } from '../ui/badge'
import { useBillingCycle } from './useBillingCycle'

export function BillingCycleSelect() {
  const { cycle, setCycle } = useBillingCycle()
  return (
    <ToggleGroup
      className="h-12 gap-3 rounded-lg bg-accent p-1"
      value={cycle}
      onValueChange={(v) => {
        setCycle(v as BillingCycle)
      }}
      type="single"
    >
      <ToggleGroupItem
        className="h-full flex-1 bg-accent text-sm font-semibold ring-foreground data-[state=on]:bg-background w-32 flex"
        value={BillingCycle.MONTHLY}
      >
        Monthly
      </ToggleGroupItem>

      <ToggleGroupItem
        value={BillingCycle.YEARLY}
        className="h-full flex-1 bg-accent text-sm font-semibold ring-foreground data-[state=on]:bg-background w-36 flex"
      >
        Yearly
        <Badge className="shrink-0 ml-1">25% off</Badge>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
