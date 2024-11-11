'use client'

import { useMemberDialog } from '@/components/MemberDialog/useMemberDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plan } from '@/domains/Plan'
import { useAddress } from '@/hooks/useAddress'
import { useEthPrice } from '@/hooks/useEthPrice'
import { useMembers } from '@/hooks/useMembers'
import { useSpace } from '@/hooks/useSpace'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { EditIcon } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useUpdatePlanDialog } from './UpdatePlanDialog/useUpdatePlanDialog'

interface Props {
  plan: Plan
}

export function PlanItem({ plan }: Props) {
  const address = useAddress()
  const { ethPrice } = useEthPrice()
  const { setState } = useUpdatePlanDialog()
  const { space } = useSpace()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { subscriptions } = useSubscriptions()
  const { setState: setMemberState } = useMemberDialog()
  const subscription = subscriptions.find((s) => s.planId === plan.id)!
  const { members } = useMembers()
  const isMember = members?.some(
    (m) => m.account === address && m.planId === plan.id,
  )

  return (
    <Card className="flex flex-col justify-between min-h-[400px] p-4 shadow-muted relative">
      {space.isFounder(address) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 rounded-full"
          onClick={() => setState({ isOpen: true, plan: plan })}
        >
          <EditIcon size={20} className="text-neutral-400" />
        </Button>
      )}
      <div>
        <div className="flex">
          <div>{plan.name}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="font-bold text-2xl">
            {plan.getUsdPrice(ethPrice).toFixed(2)} USD
          </div>
          <div>/ month</div>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          if (!isConnected) return openConnectModal?.()
          setMemberState({
            isOpen: true,
            plan,
            subscription,
          })
        }}
      >
        <span className="i-[token--eth] w-6 h-6"></span>
        {isMember && <div>Update subscription</div>}
        {!isMember && <div>Become a member</div>}
      </Button>
    </Card>
  )
}
