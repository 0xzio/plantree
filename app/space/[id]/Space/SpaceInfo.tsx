'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useQuerySpace, useSpace } from '@/hooks/useSpace'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import { SpaceBasicInfo } from './SpaceBasicInfo'
import { SpaceStats } from './SpaceStats'

interface Props {}

export function SpaceInfo({}: Props) {
  const { isLoading } = useQuerySpace()
  const { space } = useSpace()

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="flex  justify-between w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="w-20 h-5" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-20 h-10" />
            <Skeleton className="w-20 h-10" />
          </div>
        </div>

        <Skeleton className="h-[120px]" />

        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-[350px] rounded-4xl" />
          <Skeleton className="h-[350px] rounded-4xl" />
        </div>
      </div>
    )
  }

  if (!space) return null

  return (
    <div className="grid gap-6">
      <SpaceBasicInfo />
    </div>
  )
}
