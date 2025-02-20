'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LinkNodeForm } from './LinkNodeForm'
import { useLinkNodeDialog } from './useLinkNodeDialog'

interface Props {}

export function LinkNodeDialog({}: Props) {
  const { isOpen, setIsOpen, node } = useLinkNodeDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">
            {node ? 'Edit link' : 'Add link'}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <LinkNodeForm />
      </DialogContent>
    </Dialog>
  )
}
