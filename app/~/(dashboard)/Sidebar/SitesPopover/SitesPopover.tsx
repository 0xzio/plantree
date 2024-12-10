'use client'

import { memo } from 'react'
import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMySites } from '@/hooks/useMySites'
import { useSite } from '@/hooks/useSite'
import { ROOT_DOMAIN } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSignIn } from '@farcaster/auth-kit'
import { AuthType, SiteMode } from '@prisma/client'
import {
  DatabaseBackup,
  FileText,
  Gauge,
  Home,
  KeySquare,
  LogOut,
  Settings,
  UserCog,
  UserRound,
  Wallet,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

interface Props {
  className?: string
}

export const SitesPopover = memo(function ProfilePopover({
  className = '',
}: Props) {
  const { data } = useSession()
  const { push } = useRouter()
  const sigInState = useSignIn({})
  const pathname = usePathname()
  const { data: sites = [] } = useMySites()

  if (!data) return <div></div>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>Space</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup className="px-2 py-1">
          <ProfileAvatar showAddress showCopy />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {sites.map((site) => (
          <DropdownMenuItem
            key={site.id}
            className="cursor-pointer"
            onClick={async () => {
              //
            }}
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={site.logo!} alt="" />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>{site.name}</div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            try {
              await signOut()
              sigInState?.signOut()
              push('/')
            } catch (error) {}
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
