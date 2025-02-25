'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { LoadingDots } from '../icons/loading-dots'

interface Props {
  type: 'FREE' | 'CREATOR' | 'TEAM'
}

export function BecomeMemberButton({ type }: Props) {
  const { setIsOpen } = useLoginDialog()
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname.includes('~/settings')

  const { isPending, mutateAsync } = trpc.billing.checkout.useMutation()

  return (
    <Button
      size="lg"
      className="rounded-full px-8 w-32 h-12 font-bold"
      disabled={isPending}
      onClick={async () => {
        if (isDashboard) {
          const data = await mutateAsync({ planType: 'FREE' })
          console.log('data===>>:', data);
          location.href = data.checkout_url
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
      {isDashboard && (isPending ? <LoadingDots /> : 'Upgrade')}
    </Button>
  )
}
