'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSiteContext } from './SiteContext'
import { Avatar, AvatarFallback } from './ui/avatar'

interface Props extends ButtonProps {}

export const WalletConnectButton = ({ onClick, ...props }: Props) => {
  const { openConnectModal } = useConnectModal()

  async function onOpen(e: any) {
    openConnectModal?.()
    setTimeout(() => {
      onClick?.(e)
    }, 10)
  }

  // if (address) {
  //   return (
  //     <Avatar className="h-8 w-8">
  //       <AvatarFallback></AvatarFallback>
  //     </Avatar>
  //   )
  // }

  return (
    <Button onClick={onOpen} {...props}>
      {props.children ? props.children : 'Connect'}
    </Button>
  )
}
