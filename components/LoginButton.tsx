'use client'

import { Trans } from '@lingui/react/macro'
import { useAuthStatus } from './LoginDialog/useAuthStatus'
import { useLoginDialog } from './LoginDialog/useLoginDialog'
import { Button, ButtonProps } from './ui/button'

interface Props extends ButtonProps {}
export function LoginButton({ ...rest }: Props) {
  const { setIsOpen } = useLoginDialog()
  const { setAuthStatus } = useAuthStatus()
  return (
    <Button
      size="sm"
      // variant="secondary"
      {...rest}
      onClick={() => {
        setIsOpen(true)
        setAuthStatus('login')
      }}
    >
      {rest.children ? rest.children : <Trans>Sign in</Trans>}
    </Button>
  )
}
