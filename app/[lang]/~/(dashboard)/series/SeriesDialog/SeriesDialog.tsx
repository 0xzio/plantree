'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SeriesForm } from './SeriesForm'
import { useSeriesDialog } from './useSeriesDialog'

export function SeriesDialog() {
  const { isOpen, setIsOpen, series } = useSeriesDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{!!series ? 'Update series' : 'Add series'}</DialogTitle>
        </DialogHeader>
        <SeriesForm />
      </DialogContent>
    </Dialog>
  )
}
