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
import { PriceForm } from './PriceForm'
import { usePriceDialog } from './usePriceDialog'

export function PriceDialog() {
  const { isOpen, setIsOpen, tier } = usePriceDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Update price</DialogTitle>
        </DialogHeader>
        <PriceForm />
      </DialogContent>
    </Dialog>
  )
}
