'use client'

import { MemberDialog } from '@/components/MemberDialog/MemberDialog'
import { useAddress } from '@/hooks/useAddress'
import { usePlans } from '@/hooks/usePlans'
import { useSpace } from '@/hooks/useSpace'
import { AddPlanDialog } from './AddPlanDialog/AddPlanDialog'
import { PlanItem } from './PlanItem'
import { UpdatePlanDialog } from './UpdatePlanDialog/UpdatePlanDialog'

interface Props {}

export function PlanList({}: Props) {
  const { plans, isLoading } = usePlans()
  const { space } = useSpace()
  const address = useAddress()

  if (isLoading) return <div className="text-neutral-500">Loading...</div>

  if (!plans.length) {
    return <div className="text-neutral-500">No plans yet!</div>
  }

  return (
    <div>
      {space.isFounder(address) && <AddPlanDialog />}

      <UpdatePlanDialog />
      <MemberDialog />
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
        {plans.map((item, index) => {
          return <PlanItem key={index} plan={item} />
        })}
      </div>
    </div>
  )
}
