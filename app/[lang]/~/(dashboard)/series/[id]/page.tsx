'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { SeriesProvider } from '@/components/SeriesContext'
import { useSeriesItem } from '@/hooks/useSeriesItem'
import { SeriesDialog } from '../SeriesDialog/SeriesDialog'
import { CatalogueBox } from './CatalogueBox/CatalogueBox'
import { SeriesInfo } from './SeriesInfo'
import { SeriesNav } from './SeriesNav'

export const dynamic = 'force-static'

export default function Page() {
  const { data, isLoading } = useSeriesItem()

  if (isLoading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <LoadingDots></LoadingDots>
      </div>
    )
  }

  return (
    <SeriesProvider series={data!}>
      <SeriesDialog />
      <div className="h-full">
        <SeriesNav />
        <div className="flex flex-col  gap-8 mx-auto max-w-3xl border p-8 rounded-xl h-ful">
          <SeriesInfo />
          <CatalogueBox />
        </div>
      </div>
    </SeriesProvider>
  )
}
