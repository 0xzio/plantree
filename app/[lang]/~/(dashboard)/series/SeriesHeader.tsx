'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useSeriesDialog } from './SeriesDialog/useSeriesDialog'

export function SeriesHeader() {
  const { setIsOpen } = useSeriesDialog()
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Series</h2>
      </div>
      <Button
        variant="default"
        size="icon"
        className="w-8 h-8"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon size={24} />
      </Button>
    </div>
  )
}
