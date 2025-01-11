'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import LoadingDots from './icons/loading-dots'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useSubscriptionDialog } from './SubscriptionDialog/useSubscriptionDialog'

export function UseCouponCode() {
  const [couponCode, setCouponCode] = useState('')
  const { setIsOpen } = useSubscriptionDialog()
  const { update } = useSession()
  const { isPending, mutateAsync } = trpc.coupon.useCouponCode.useMutation()
  return (
    <div className="flex items-center gap-2 mt-4">
      <div className="text-foreground/60 flex-shrink-0">
        I have a coupon code:{' '}
      </div>
      <Input
        size="sm"
        placeholder="Enter coupon code"
        className="rounded-lg"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <Button
        size="sm"
        disabled={isPending}
        variant="outline-solid"
        className="w-20"
        onClick={async () => {
          try {
            await mutateAsync({ code: couponCode.trim() })
            await update()
            setIsOpen(false)
            toast.success('Coupon code applied successfully')
          } catch (error) {
            toast.error('Invalid coupon code')
          }
        }}
      >
        {isPending ? <LoadingDots className="bg-foreground/60" /> : 'Use it'}
      </Button>
    </div>
  )
}
