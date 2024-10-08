'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useHolders } from '@/hooks/useHolders'
import { useSpace } from '@/hooks/useSpace'
import { precision } from '@/lib/math'
import { cn, shortenAddress } from '@/lib/utils'

interface Props {}

export function HolderList({}: Props) {
  const { space } = useSpace()
  const { holders, isLoading } = useHolders()

  if (isLoading) {
    return (
      <div className="grid gap-3 mt-4">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-6" />
          ))}
      </div>
    )
  }

  if (!holders?.length) {
    return <div className="text-neutral-500">No trades yet!</div>
  }

  return (
    <div className="space-y-3 mt-4">
      {holders.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <div className="flex gap-2 items-center">
            <UserAvatar address={item.account} className="w-6 h-6" />
            <div className="text-sm">{shortenAddress(item.account)}</div>
          </div>
          <div className="flex gap-1">
            <span className="font-bold">
              {precision.toDecimal(item.balance).toFixed(2)}
            </span>
            {space.symbolName}
          </div>
        </div>
      ))}
    </div>
  )
}
