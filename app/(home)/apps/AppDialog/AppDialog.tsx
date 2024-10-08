'use client'

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
import { AppForm } from './AppForm'
import { useAppDialog } from './useAppDialog'

export function AppDialog() {
  const { isOpen, setIsOpen } = useAppDialog()
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[460px]">
        <AppForm />
      </DialogContent>
    </Dialog>
  )
}
