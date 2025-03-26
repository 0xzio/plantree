'use client'

import { memo, useCallback, useEffect } from 'react'
import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
import { useSiteContext } from '@/components/SiteContext'
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
import { getDashboardPath } from '@/lib/getDashboardPath'
import { useRouter } from '@/lib/i18n'
import { queryClient } from '@/lib/queryClient'
import { useSession } from '@/lib/useSession'
import { cn, getUrl } from '@/lib/utils'
import { useSignIn } from '@farcaster/auth-kit'
import { get, set } from 'idb-keyval'
import {
  ChevronDown,
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

interface Props {
  className?: string
}

export const SitesPopover = memo(function ProfilePopover({
  className = '',
}: Props) {
  const { data, logout, update } = useSession()
  const { push } = useRouter()
  const sigInState = useSignIn({})
  const { data: sites = [] } = useMySites()
  const site = useSiteContext()

  if (!data) return <div></div>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer w-full px-2 py-2 flex-1 -mx-2 rounded-lg hover:bg-foreground/5 transition-colors">
          <div className="flex items-center gap-1">
            <Avatar className="w-6 h-6">
              <AvatarImage src={getUrl(site.logo!)} alt="" />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>{site.name}</div>
          </div>
          <ChevronDown size={14} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup className="px-2 py-1">
          <ProfileAvatar showName showCopy />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {sites.map((site) => (
          <DropdownMenuItem
            key={site.id}
            className="cursor-pointer flex items-center gap-2"
            onClick={async () => {
              queryClient.setQueriesData({ queryKey: ['current_site'] }, site)

              window.__SITE_ID__ = site.id
              update({
                type: 'update-active-site',
                activeSiteId: site.id,
              })
              push(getDashboardPath(site))
            }}
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={getUrl(site.logo!)} alt="" />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>{site.name}</div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            try {
              await logout()
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
