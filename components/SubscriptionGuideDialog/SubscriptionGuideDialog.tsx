'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SubscriptionGuideDialogContent } from './SubscriptionGuideDialogContent'
import { useSubscriptionGuideDialog } from './useSubscriptionGuideDialog'

interface Props {}

export function SubscriptionGuideDialog({}: Props) {
  const { isOpen, setIsOpen } = useSubscriptionGuideDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[600px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Subscribe to Plantree</DialogTitle>
          <DialogDescription>
            Subscribe to Penx to support us in building the best product and
            enjoy the features:
          </DialogDescription>
        </DialogHeader>
        <SubscriptionGuideDialogContent />
      </DialogContent>
    </Dialog>
  )
}
