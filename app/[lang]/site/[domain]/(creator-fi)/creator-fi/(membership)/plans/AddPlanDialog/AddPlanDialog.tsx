import { useSpaceContext } from '@/components/SpaceContext'
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
import { useAddress } from '@/hooks/useAddress'
import { AddPlanForm } from './AddPlanForm'
import { useAddPlanDialog } from './useAddPlanDialog'

export function AddPlanDialog() {
  const space = useSpaceContext()
  const address = useAddress()
  const { isOpen, setIsOpen } = useAddPlanDialog()
  if (!space.isFounder(address)) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" onClick={() => setIsOpen(true)}>
          Add Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Plan</DialogTitle>
        </DialogHeader>
        <AddPlanForm />
      </DialogContent>
    </Dialog>
  )
}
