'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UpdateSpaceForm } from './UpdateSpaceForm'
import { useUpdateSpaceDialog } from './useUpdateSpaceDialog'

export function UpdateSpaceDialog() {
  const { isOpen, setIsOpen } = useUpdateSpaceDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Config domain</DialogTitle>
        </DialogHeader>
        <UpdateSpaceForm />
      </DialogContent>
    </Dialog>
  )
}
