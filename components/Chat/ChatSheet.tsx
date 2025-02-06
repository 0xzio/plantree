'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Chat } from './Chat'
import { ChatEntry } from './ChatEntry'
import { useChatSheet } from './useChatSheet'

export function ChatSheet() {
  const { isOpen, setIsOpen } = useChatSheet()
  return (
    <>
      <ChatEntry />
      <Sheet open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <SheetDescription className="hidden"></SheetDescription>
        <SheetContent className="flex flex-col gap-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chat</SheetTitle>
          </SheetHeader>
          <Chat />
        </SheetContent>
      </Sheet>
    </>
  )
}
