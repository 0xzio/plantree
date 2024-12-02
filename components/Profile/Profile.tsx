'use client'

import { useSite } from '@/hooks/useSite'
import { SiteMode } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import LoginButton from '../LoginButton'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { ProfileDialog } from './ProfileDialog/ProfileDialog'
import { ProfilePopover } from './ProfilePopover'

interface Props {}

export function Profile({}: Props) {
  const { data, status } = useSession()
  const { site } = useSite()

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
      {!authenticated && <LoginButton />}
      {authenticated && (
        <>
          <Link
            href={
              site.mode === SiteMode.BASIC ? '/~/posts' : '/~/objects/today'
            }
          >
            <Button size="sm">Dashboard</Button>
          </Link>
          <ProfilePopover />
        </>
      )}
    </>
  )
}
