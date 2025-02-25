'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PlanList } from './PlanList'
import { usePlanListDialog } from './usePlanListDialog'

interface Props {}

export function PlanListDialog({}: Props) {
  const { isOpen, setIsOpen } = usePlanListDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[1120px] grid gap-4">
        <DialogHeader className="hidden">
          <DialogTitle className=""></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PlanList />
      </DialogContent>
    </Dialog>
  )
}
