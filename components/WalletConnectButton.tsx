'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useConnectModal } from '@rainbow-me/rainbowkit'

interface Props extends ButtonProps {}

export const WalletConnectButton = (props: Props) => {
  const { openConnectModal } = useConnectModal()
  async function onOpen() {
    openConnectModal?.()
  }

  function onClick() {
    onOpen()
  }

  return (
    <Button onClick={onClick} {...props}>
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}
