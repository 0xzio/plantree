'use client'

import { usePlanListDialog } from '@/components/PlanList/usePlanListDialog'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/useSession'
import { PlanType } from '@prisma/client'
import { ZapIcon } from 'lucide-react'

interface Props {}

export function UpgradeButton({}: Props) {
  const { data: session } = useSession()
  const { setIsOpen } = usePlanListDialog()

  if (session?.planType === PlanType.FREE) {
    return (
      <div className="px-4 mb-4">
        <Button
          size="lg"
          className="rounded-full font-bold w-full items-center flex gap-1"
          onClick={async () => {
            setIsOpen(true)
          }}
        >
          <ZapIcon size={16} />
          <span>Upgrade</span>
        </Button>
      </div>
    )
  }
  return null
}
