import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { CreateSpaceForm } from './CreateSpaceForm'
import { useCreateSpaceDialog } from './useCreateSpaceDialog'

export function CreateSpaceDialog() {
  const { isOpen, setIsOpen } = useCreateSpaceDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create site</DialogTitle>
        </DialogHeader>
        <CreateSpaceForm />
      </DialogContent>
    </Dialog>
  )
}
