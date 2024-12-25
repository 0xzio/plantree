'use client'

import { useEffect } from 'react'
import { useLoginDialog } from './LoginDialog/useLoginDialog'
import { Button } from './ui/button'

export function LoginButton() {
  const { setIsOpen } = useLoginDialog()
  return (
    <Button
      variant="secondary"
      onClick={() => {
        console.log('gogo.....')

        setIsOpen(true)
      }}
    >
      Sign in
    </Button>
  )
}
