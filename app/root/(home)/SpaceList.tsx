'use client'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useQueryLogoImages } from '@/hooks/useLogoImages'
import { useSpaces } from '@/hooks/useSpaces'
import { precision } from '@/lib/math'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { SpaceLogo } from './SpaceLogo'

export function SpaceList() {
  const { isLoading, data: spaces = [] } = useSpaces()
  useQueryLogoImages(spaces)
  if (isLoading)
    return (
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
          {Array(9)
            .fill('')
            .map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'flex items-center justify-between p-5 gap-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all h-[116px]',
                )}
              ></Skeleton>
            ))}
        </div>
      </div>
    )

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
      {spaces.map((space, index) => (
        <Link
          key={space.id}
          href={`/space/${space.id}`}
          className={cn(
            'flex items-center justify-between p-5 gap-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all',
            // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
          )}
        >
          <div className="flex items-center gap-2">
            <SpaceLogo uri={space.uri} />

            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <div className="text-xl font-semibold mr-3">{space.name}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-foreground/80 text-sm">
                  ${space.symbol}
                </div>
                <div className="text-xs text-foreground/60">
                  TVL {precision.toDecimal(space.ethVolume).toFixed(6)} ETH
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-foreground/60">
                  {space.memberCount} members
                </div>
                <div className="flex gap-1">
                  {space.members.map((item) => (
                    <UserAvatar
                      key={item.id}
                      address={item.account}
                      className={cn('w-5 h-5')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
