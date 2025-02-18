'use client'

import { useAuthStatus } from './LoginDialog/useAuthStatus'
import { useLoginDialog } from './LoginDialog/useLoginDialog'
import { Button, ButtonProps } from './ui/button'

interface Props extends ButtonProps {}
export function LoginButton({ ...rest }: Props) {
  const { setIsOpen } = useLoginDialog()
  const { setAuthStatus } = useAuthStatus()
  return (
    <Button
      variant="secondary"
      {...rest}
      onClick={() => {
        setIsOpen(true)
        setAuthStatus('login')
      }}
    >
      {rest.children ? rest.children : 'Sign in'}
    </Button>
  )
}
