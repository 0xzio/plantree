import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { InputAddressForm } from './InputAddressForm'
import { useInputAddressDialog } from './useInputAddressDialog'

export function InputAddressDialog() {
  const { isOpen, setIsOpen } = useInputAddressDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Wallet address</DialogTitle>
        </DialogHeader>
        <InputAddressForm />
      </DialogContent>
    </Dialog>
  )
}
