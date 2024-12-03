'use client'

import { MemberDialog } from '@/components/MemberDialog/MemberDialog'
import { usePlans } from '@/hooks/usePlans'
import { cn } from '@/lib/utils'
import { PlanItem } from './PlanItem'
import { UpdatePlanDialog } from './UpdatePlanDialog/UpdatePlanDialog'

interface Props {
  align?: 'center' | 'left'
  className?: string
}

export function PlanList({ className, align = 'left' }: Props) {
  const { plans, isLoading } = usePlans()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!plans.length) {
    return <div className="text-foreground/60">No plans yet!</div>
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <UpdatePlanDialog />
      <MemberDialog />
      <div
        className={cn(
          'mt-4 flex items-center gap-4 flex-wrap',
          className,
          align == 'center' && 'justify-center',
        )}
      >
        {plans.map((item, index) => {
          if (!item.isActive) return null
          return <PlanItem key={index} plan={item} />
        })}
      </div>
    </div>
  )
}
