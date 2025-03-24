'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Image } from '@/components/Image'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc'
import { SeriesItem } from './SeriesItem'

export function SeriesList() {
  const { data = [], isLoading } = trpc.series.getSeriesList.useQuery()

  if (isLoading) {
    return (
      <div className="flex justify-between items-center h-96 w-full">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {data.map((item) => (
          <SeriesItem key={item.id} series={item} />
        ))}
      </div>
    </div>
  )
}
