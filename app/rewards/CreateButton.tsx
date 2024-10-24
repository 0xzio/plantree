'use client'

import { Button } from '@/components/ui/button'
import { useAppKit } from '@reown/appkit/react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function CreateButton() {
  const { open } = useAppKit()
  const { isConnected } = useAccount()
  const { push } = useRouter()
  return (
    <Button
      variant="default"
      className="rounded-2xl border border-black hover:bg-black hover:text-white"
      onClick={() => {
        if (!isConnected) return open()
        push('/rewards/create')
      }}
    >
      Create a new request
    </Button>
  )
}
