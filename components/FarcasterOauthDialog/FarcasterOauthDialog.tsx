'use client'

import LoadingDots from '@/components/icons/loading-dots'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useFarcasterOauthDialog } from './useFarcasterOauthDialog'

export function FarcasterOauthDialog() {
  const { isOpen, setIsOpen } = useFarcasterOauthDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        closable={false}
        className="h-64 flex items-center justify-center w-[90%] sm:max-w-[425px] rounded-xl focus-visible:outline-none"
      >
        <span className="i-[simple-icons--farcaster] w-6 h-6"></span>
        <div className="text-lg">Farcaster logging in</div>
        <LoadingDots className="bg-foreground/60" />
      </DialogContent>
    </Dialog>
  )
}
