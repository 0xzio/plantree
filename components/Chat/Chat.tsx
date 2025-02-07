'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Subscription } from '@/domains/Subscription'
import { spaceAbi } from '@/lib/abi'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { useSiteContext } from '../SiteContext'
import ChatView from './chatView'

export function Chat() {
  const site = useSiteContext()

  const { data: session, status } = useSession()
  const { address } = useAccount()

  const { data: subs } = useReadContract({
    abi: spaceAbi,
    address: site?.spaceId as Address,
    functionName: 'getSubscriptions',
    args: [],
  })

  const { isLoading, data } = useReadContract({
    abi: spaceAbi,
    address: site?.spaceId as Address,
    functionName: 'getSubscription',
    args: [0, address!],
    query: {
      enabled: Boolean(site?.spaceId && address),
    },
  })

  if (status === 'loading' || isLoading || !site?.channels?.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingDots className="bg-foreground/60"></LoadingDots>
      </div>
    )
  }

  const tipJSX = (
    <div className="h-[60vh] flex flex-col gap-2 items-center justify-center">
      <div className="px-10 text-center text-foreground/60">
        You need to purchase a Site Token to subscribe for member-only chat
        access.
      </div>
      <Link href="/membership" target="_blank">
        <Button>Be a member</Button>
      </Link>
    </div>
  )

  console.log('=======data:', data, 'subs:', subs)
  if (!data) return tipJSX

  const subscription = new Subscription(data!)

  if (!subscription.isMember) {
    return tipJSX
  }

  return (
    <ChatView
      token={session?.accessToken || ''}
      siteId={site.id}
      channels={site.channels}
      userId={session?.userId as string}
      displayName={session?.user?.name || ''}
      image={session?.user?.image || ''}
    />
  )
}
