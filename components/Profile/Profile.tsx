'use client'

import { useSite } from '@/hooks/useSite'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getDashboardPath } from '@/lib/getDashboardPath'
import { useRouter } from '@/lib/i18n'
import { useSession } from '@/lib/useSession'
import { LoginButton } from '../LoginButton'
import { LoginDialog } from '../LoginDialog/LoginDialog'
import { useLoginDialog } from '../LoginDialog/useLoginDialog'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button, ButtonProps } from '../ui/button'
import { ProfilePopover } from './ProfilePopover'

interface Props {
  showDashboard?: boolean
  buttonProps?: ButtonProps
}

export function Profile({ showDashboard = false, buttonProps }: Props) {
  const { data, status } = useSession()
  const { site } = useSite()
  const { push } = useRouter()

  if (status === 'loading')
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback></AvatarFallback>
      </Avatar>
    )

  const authenticated = !!data

  return (
    <>
      <LoginDialog />
      {!authenticated && <LoginButton {...buttonProps} />}
      {authenticated && (
        <div className="flex items-center gap-2">
          {showDashboard && (
            <Button
              size="sm"
              onClick={() => {
                const path = getDashboardPath(site)

                if (location.host === ROOT_DOMAIN) {
                  push(path)
                  return
                }
                location.href = `${location.protocol}//${ROOT_DOMAIN}${path}`
              }}
            >
              Dashboard
            </Button>
          )}
          <ProfilePopover />
        </div>
      )}
    </>
  )
}
