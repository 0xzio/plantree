'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

export function BecomeMemberButton() {
  const { setIsOpen } = useLoginDialog()
  const { data } = useSession()

  return (
    <Button
      size="lg"
      className="rounded-full px-8 h-12 font-bold"
      onClick={() => {
        if (!data) {
          setIsOpen(true)
        } else {
          // TODO:
          // Redirect to checkout page
        }
      }}
    >
      Become a member
    </Button>
  )
}
