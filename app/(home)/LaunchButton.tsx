'use client'

import { Button } from '@/components/ui/button'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function LaunchButton() {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { push } = useRouter()
  return (
    <Button
      variant="brand"
      className=""
      onClick={() => {
        if (!isConnected) return openConnectModal?.()
        push('/create-space')
      }}
    >
      Create a site
    </Button>
  )
}
