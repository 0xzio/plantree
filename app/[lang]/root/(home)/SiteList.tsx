'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useHomeSites } from '@/hooks/useHomeSites'
import { MySite } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SiteItem } from './SiteItem'

interface Props {
  sites?: MySite[]
}

export function SiteList({ sites }: Props) {
  const { isLoading, data } = useHomeSites()

  if (isLoading || !data)
    return (
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
          {Array(9)
            .fill('')
            .map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'flex items-center justify-between p-5 gap-3 bg-background rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all h-[96px] dark:bg-foreground/5',
                )}
              ></Skeleton>
            ))}
        </div>
      </div>
    )

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
      {data.map((site) => (
        <SiteItem key={site.id} site={site} />
      ))}
    </div>
  )
}
