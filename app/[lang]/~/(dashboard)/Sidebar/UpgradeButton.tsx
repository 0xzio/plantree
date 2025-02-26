'use client'

import { usePlanListDialog } from '@/components/PlanList/usePlanListDialog'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/useSession'
import { PlanType } from '@prisma/client'

interface Props {}

export function UpgradeButton({}: Props) {
  const { data: session } = useSession()
  const { setIsOpen } = usePlanListDialog()

  if (session?.planType === PlanType.FREE) {
    return (
      <div className="px-4 mb-4">
        <Button
          size="lg"
          className="rounded-full px-8  h-12 font-bold w-full"
          onClick={async () => {
            setIsOpen(true)
          }}
        >
          Upgrade
        </Button>
      </div>
    )
  }
  return null
}
