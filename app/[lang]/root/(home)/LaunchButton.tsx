'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from '@/lib/i18n'
import { Trans } from '@lingui/react/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
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
      <Trans>Create a site</Trans>
    </Button>
  )
}
