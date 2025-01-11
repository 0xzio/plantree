'use client'

import { useSubscriptionDialog } from '@/components/SubscriptionDialog/useSubscriptionDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UseCouponCode } from '@/components/UseCouponCode'
import { useIsMember } from '@/hooks/useIsMember'

interface Props {}

export function Subscription({}: Props) {
  const { setIsOpen } = useSubscriptionDialog()
  const isMember = useIsMember()
  return (
    <div className="flex flex-col gap-3">
      <div className="text-2xl font-bold">Subscription</div>
      <div className="text-foreground/60">
        Subscribe to Penx to support us in building the best product.
      </div>

      <div>
        <Button
          className="px-8 h-12 font-bold"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Subscribe
        </Button>
      </div>
      <Separator className="my-8"></Separator>

      <UseCouponCode></UseCouponCode>
    </div>
  )
}
