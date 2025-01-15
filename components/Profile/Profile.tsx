'use client'

import { useSite } from '@/hooks/useSite'
import { ROOT_DOMAIN } from '@/lib/constants'
import { SiteMode } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoginButton } from '../LoginButton'
import { LoginDialog } from '../LoginDialog/LoginDialog'
import { useLoginDialog } from '../LoginDialog/useLoginDialog'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { ProfileDialog } from './ProfileDialog/ProfileDialog'
import { ProfilePopover } from './ProfilePopover'

interface Props {}

export function Profile({}: Props) {
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
      <ProfileDialog />
      <LoginDialog />
      {!authenticated && <LoginButton />}
      {authenticated && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              const path = '/~/page?id=today'

              if (location.host === ROOT_DOMAIN) {
                push(path)
                return
              }
              location.href = `${location.protocol}//${ROOT_DOMAIN}${path}`
            }}
          >
            Dashboard
          </Button>
          <ProfilePopover />
        </div>
      )}
    </>
  )
}
