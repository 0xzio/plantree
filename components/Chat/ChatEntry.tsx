'use client'

import { Button } from '@/components/ui/button'
import { MessageCircleMore } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLoginDialog } from '../LoginDialog/useLoginDialog'
import { useChatSheet } from './useChatSheet'

export function ChatEntry() {
  const { setIsOpen } = useChatSheet()
  const loginDialog = useLoginDialog()
  const { data } = useSession()

  return (
    <Button
      size="icon"
      variant="default"
      className="fixed bottom-4 right-4 bg-background shadow hover:bg-background hover:ring-2 ring-foreground transition-colors dark:bg-foreground/10"
      onClick={() => {
        if (data) {
          setIsOpen(true)
        } else {
          loginDialog.setIsOpen(true)
        }
      }}
    >
      <MessageCircleMore size={24} className="text-foreground" />
    </Button>
  )
}
