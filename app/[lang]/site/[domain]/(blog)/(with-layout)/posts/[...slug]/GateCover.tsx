'use client'

import { Button } from '@/components/ui/button'
import { usePathname } from '@/lib/i18n'
import { useSession } from '@/lib/useSession'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

interface Props {
  slug: string
}

export function GateCover({ slug }: Props) {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { data } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()!
  return (
    <div className="h-80 absolute bottom-0 w-full bg-gradient-to-t from-background from-50% via-background/80 via-90% to-95% to-background/0 flex flex-col justify-center gap-6 -mt-16">
      <div className="text-center font-semibold text-2xl">
        The creator made this a member only post.
      </div>
      <div className="flex justify-center gap-3 items-center">
        <Button
          size="lg"
          className="w-48 rounded-xl"
          onClick={() => {
            push(`/subscribe?source=${pathname}`)
            // if (!isConnected) {
            //   openConnectModal?.()
            // }
            // if (data) {
            //   location.href = `/membership?post_slug=${slug}`
            // }
          }}
        >
          Become a member
        </Button>
      </div>
    </div>
  )
}
