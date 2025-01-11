'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SubscriptionDialogContent } from './SubscriptionDialogContent'
import { useSubscriptionDialog } from './useSubscriptionDialog'

interface Props {}

export function SubscriptionDialog({}: Props) {
  const { isOpen, setIsOpen } = useSubscriptionDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[600px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Subscribe to PenX</DialogTitle>
          <DialogDescription>
            Subscribe to Penx to support us in building the best product and
            enjoy the features:
          </DialogDescription>
        </DialogHeader>
        <SubscriptionDialogContent />
      </DialogContent>
    </Dialog>
  )
}
