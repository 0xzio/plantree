'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoginDialogContent } from './LoginDialogContent'
import { useLoginDialog } from './useLoginDialog'

interface Props {}

export function LoginDialog({}: Props) {
  const { isOpen, setIsOpen } = useLoginDialog()
  console.log('x=====isOpen:', isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Login</DialogTitle>
          <DialogDescription>Login to write post</DialogDescription>
        </DialogHeader>
        <LoginDialogContent />
      </DialogContent>
    </Dialog>
  )
}
