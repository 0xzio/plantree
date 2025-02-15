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
import { CURRENT_SITE, ROOT_DOMAIN } from '@/lib/constants'
import { getDashboardPath } from '@/lib/getDashboardPath'
import { queryClient } from '@/lib/queryClient'
import { cn, getUrl } from '@/lib/utils'
import { useSignIn } from '@farcaster/auth-kit'
import { AuthType, SiteMode } from '@prisma/client'
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
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  className?: string
}

export const SitesPopover = memo(function ProfilePopover({
  className = '',
}: Props) {
  const { data } = useSession()
  const { push } = useRouter()
  const sigInState = useSignIn({})
  const { data: sites = [] } = useMySites()
  const site = useSiteContext()

  const initSiteId = useCallback(async () => {
    const site = await get(CURRENT_SITE)
    console.log('====site:', site)

    if (!site) {
      console.log('set.......x')
      await set(CURRENT_SITE, sites[0])
    }
  }, [sites])

  useEffect(() => {
    if (!sites?.length) return
    initSiteId()
  }, [sites, initSiteId])

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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup className="px-2 py-1">
          <ProfileAvatar showName showCopy />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {sites.map((site) => (
          <DropdownMenuItem
            key={site.id}
            className="cursor-pointer flex items-center gap-2"
            onClick={async () => {
              queryClient.setQueriesData(
                {
                  queryKey: ['current_site'],
                },
                site,
              )
              await set(CURRENT_SITE, site)
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
