'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAddress } from '@/hooks/useAddress'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { useAppDialog } from './AppDialog/useAppDialog'

export function CreateAppButton() {
  const address = useAddress()
  const { open } = useAppKit()
  const { isConnected } = useAccount()
  const { setIsOpen } = useAppDialog()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  if (address !== '0x45aBBC64421a54CbffF878985AE6c4F0cfacfDb7') {
    return <div></div>
  }

  return (
    <Button
      size="lg"
      className="font-semibold rounded-2xl h-12 px-10 text-base"
      onClick={() => {
        if (!isConnected) return open()
        setIsOpen(true)
      }}
    >
      Create App
    </Button>
  )
}
