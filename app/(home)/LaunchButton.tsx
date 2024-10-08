'use client'

import { Button } from '@/components/ui/button'
import { useAppKit } from '@reown/appkit/react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function LaunchButton() {
  const { open } = useAppKit()
  const { isConnected } = useAccount()
  const { push } = useRouter()
  return (
    <Button
      size="lg"
      className="font-semibold rounded-2xl h-12 px-10 text-base"
      onClick={() => {
        if (!isConnected) return open()
        push('/create-space')
      }}
    >
      Create a tree
    </Button>
  )
}
