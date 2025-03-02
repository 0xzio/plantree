'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { PlanType } from '@prisma/client'
import { LoadingDots } from '../icons/loading-dots'
import { useBillingCycle } from './useBillingCycle'

interface Props {
  type: PlanType
}

export function UpgradeButton({ type }: Props) {
  const { setIsOpen } = useLoginDialog()
  const { data: session } = useSession()
  const { cycle } = useBillingCycle()
  const { push } = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname.includes('/~/')

  const { isPending, mutateAsync } = trpc.billing.checkout.useMutation()

  const isCurrentPlan = type === session?.planType
  const isFree = type === PlanType.FREE
  const isCanceled = session?.subscriptionStatus === 'canceled'
  function getText() {
    if (session?.subscriptionStatus === 'canceled' && !isFree) {
      return 'Upgrade'
    }
    if (isCurrentPlan) return 'Current plan'
    if (isFree) return 'Free'
    return session?.isFree ? 'Upgrade' : 'Change plan'
  }

  return (
    <Button
      size="lg"
      className="rounded-full px-8 w-32 h-12 font-bold"
      disabled={isPending || (isCurrentPlan && !isCanceled) || isFree}
      onClick={async () => {
        if (isDashboard) {
          const data = await mutateAsync({
            planType: type,
            billingCycle: cycle,
          })
          console.log('data===>>:', data, data.url)
          location.href = data.url!
          return
        }

        if (!session) {
          setIsOpen(true)
        } else {
          push('/~/settings/subscription')
        }
      }}
    >
      {!isDashboard && 'Get started'}
      {isDashboard && (isPending ? <LoadingDots /> : getText())}
    </Button>
  )
}
