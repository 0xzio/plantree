'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCatalogue } from '../hooks/useCatalogue'
import { UpdateNodeForm } from './UpdateNodeForm'
import { useUpdateNodeDialog } from './useUpdateNodeDialog'

interface Props {}

export function UpdateNodeDialog({}: Props) {
  const { isOpen, setIsOpen } = useUpdateNodeDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Rename</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <UpdateNodeForm />
      </DialogContent>
    </Dialog>
  )
}
