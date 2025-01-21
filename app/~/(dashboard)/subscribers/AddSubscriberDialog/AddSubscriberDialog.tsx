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
import { AddSubscriberForm } from './AddSubscriberForm'
import { useAddSubscriberDialog } from './useAddSubscriberDialog'

export function AddSubscriberDialog() {
  const { isOpen, setIsOpen } = useAddSubscriberDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      {/* <DialogTrigger asChild>
        <Button className="rounded-xl" onClick={() => setIsOpen(true)}>
          Add subscriber
        </Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add subscriber</DialogTitle>
        </DialogHeader>
        <AddSubscriberForm />
      </DialogContent>
    </Dialog>
  )
}
