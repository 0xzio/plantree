'use client'

import { Button } from '@/components/ui/button'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function CreateButton() {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { push } = useRouter()
  return (
    <Button
      variant="default"
      className="rounded-2xl border border-black hover:bg-black hover:text-white"
      onClick={() => {
        if (!isConnected) return openConnectModal?.()
        push('/rewards/create')
      }}
    >
      Create a new request
    </Button>
  )
}
