'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Button } from '@/components/ui/button'
import { Post, Site } from '@/lib/theme.types'
import { useSession } from '@/lib/useSession'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'

interface Props {
  site: Site
  about: any
}

export const AboutCard = ({ site, about }: Props) => {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { data } = useSession()
  const { setIsOpen } = useLoginDialog()
  const pathname = usePathname()
  return (
    <div className="mb-10 hover:text-foreground text-foreground/80">
      <div className="flex flex-col shrink-0 mb-4">
        {site.logo && (
          <Image
            src={site.logo}
            alt="avatar"
            width={192}
            height={192}
            className="h-20 w-20 rounded-full"
          />
        )}
        <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">
          {site.name}
        </h3>
        <div className="text-foreground/60">{site.description}</div>
      </div>

      <Button
        size="lg"
        className="w-full rounded-xl"
        onClick={() => {
          // if (!isConnected) {
          //   openConnectModal?.()
          // }

          if (!data) {
            setIsOpen(true)
          }
          if (data) {
            location.href = `/subscribe?source=${pathname}`
          }
        }}
      >
        Become a member
      </Button>
    </div>
  )
}
