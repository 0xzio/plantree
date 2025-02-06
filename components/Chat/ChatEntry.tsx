'use client'

import { Button } from '@/components/ui/button'
import { MessageCircleMore } from 'lucide-react'
import { useChatSheet } from './useChatSheet'

export function ChatEntry() {
  const { setIsOpen } = useChatSheet()
  return (
    <Button
      size="icon"
      variant="default"
      className="fixed bottom-4 right-4 bg-background shadow hover:bg-background hover:ring-2 ring-foreground transition-colors dark:bg-foreground/10"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      <MessageCircleMore size={24} className="text-foreground" />
    </Button>
  )
}
