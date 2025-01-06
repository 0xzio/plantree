'use client'

import { useLoginDialog } from './LoginDialog/useLoginDialog'
import { Button, ButtonProps } from './ui/button'

interface Props extends ButtonProps {}
export function LoginButton({ ...rest }: Props) {
  const { setIsOpen } = useLoginDialog()
  return (
    <Button
      variant="secondary"
      {...rest}
      onClick={() => {
        setIsOpen(true)
      }}
    >
      {rest.children ? rest.children : 'Sign in'}
    </Button>
  )
}
