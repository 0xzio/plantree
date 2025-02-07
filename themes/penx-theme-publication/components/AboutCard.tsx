'use client'

import { ContentRender } from '@/components/ContentRender/ContentRender'
import { Button } from '@/components/ui/button'
import { Post, Site } from '@penxio/types'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useAccount } from 'wagmi'

interface Props {
  site: Site
}

export const AboutCard = ({ site }: Props) => {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { data } = useSession()
  return (
    <div className="mb-10 hover:text-foreground text-foreground/80">
      <div className="flex flex-col flex-shrink-0">
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
      <div className="prose max-w-none dark:prose-invert xl:col-span-2">
        <ContentRender content={site.about} />
      </div>

      <Button
        size="lg"
        className="w-full rounded-xl"
        onClick={() => {
          if (!isConnected) {
            openConnectModal?.()
          }
          if (data) {
            location.href = `/membership`
          }
        }}
      >
        Become a member
      </Button>
    </div>
  )
}
