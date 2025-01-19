'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SubscriptionForm } from './SubscriptionForm'
import { SubscriptionPrice } from './SubscriptionPrice'
import { useSubscriptionDialog } from './useSubscriptionDialog'

interface Props {}

export function SubscriptionDialog({}: Props) {
  const { isOpen, setIsOpen } = useSubscriptionDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle>Subscription</DialogTitle>
          <DialogDescription>
            Subscribe to Penx to support us in building the best product and
            enjoy the features.
          </DialogDescription>
        </DialogHeader>
        <SubscriptionPrice />
        <SubscriptionForm />
      </DialogContent>
    </Dialog>
  )
}
