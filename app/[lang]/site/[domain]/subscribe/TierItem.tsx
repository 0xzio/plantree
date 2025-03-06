'use client'

import { PlateEditor } from '@/components/editor/plate-editor'
import { useMemberDialog } from '@/components/MemberDialog/useMemberDialog'
import { useSpaceContext } from '@/components/SpaceContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plan } from '@/domains/Plan'
import { useAddress } from '@/hooks/useAddress'
import { useEthPrice } from '@/hooks/useEthPrice'
import { useMembers } from '@/hooks/useMembers'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { Tier } from '@prisma/client'

interface Props {
  tier: Tier
}

export function TierItem({ tier }: Props) {
  const isMember = false

  return (
    <Card className="relative flex min-h-[520px] flex-col justify-between gap-4 rounded-xl p-4 shadow-none bg-background w-[300px]">
      <div className="space-y-1">
        <div className="flex">
          <div>{tier.name}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold">${Number(tier.price)}</div>
          <div>/ month</div>
        </div>
      </div>

      <div className="flex-1">
        <PlateEditor value={tier.description} readonly className="p-0" />
      </div>

      <Button
        // variant="outline"
        onClick={() => {
          //
        }}
      >
        <span className="icon-[token--eth] h-6 w-6"></span>
        {isMember && <div>Update subscription</div>}
        {!isMember && <div>Become a member</div>}
      </Button>
    </Card>
  )
}
