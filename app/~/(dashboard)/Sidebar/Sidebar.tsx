import { useMemo } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { cn, isValidUUIDv4 } from '@/lib/utils'
import { SiteMode } from '@prisma/client'
import {
  Calendar,
  CalendarDays,
  Feather,
  FileText,
  Gift,
  ImageIcon,
  Settings,
  TableProperties,
  Users,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { EnableWeb3Entry } from './EnableWeb3Entry'
import { LinkGoogleEntry } from './LinkGoogleEntry'
import { LinkWalletEntry } from './LinkWalletEntry'
import { QuickSearchTrigger } from './QuickSearchTrigger'
import { SidebarItem } from './SidebarItem'
import { SiteModeSelect } from './SiteModeSelect'
import { SitesPopover } from './SitesPopover/SitesPopover'

interface SidebarProps {
  bordered?: boolean
}
export const Sidebar = ({ bordered = true }: SidebarProps) => {
  const { data } = useSession()
  const pathname = usePathname()!
  const site = useSiteContext()
  const { spaceId } = site
  const params = useSearchParams()
  const id = params?.get('id') || ''

  const isJournalActive = useMemo(() => {
    if (!pathname.startsWith('/~/page')) return false
    if (!id) return false
    return !isValidUUIDv4(id)
  }, [pathname, id])

  return (
    <div
      className={cn(
        'flex-col flex-1 flex gap-3 h-screen border-r-sidebar',
        bordered && 'border-r',
      )}
    >
      <div className="px-4 flex items-center h-16">
        <SitesPopover />
      </div>

      <QuickSearchTrigger />

      <div className="flex flex-col gap-1 px-2">
        {/* <SidebarItem
              icon={
                <CircleCheck
                  size={18}
                  stroke={isTodosActive ? 'brand500' : 'gray500'}
                />
              }
              label="Tasks"
              isActive={isTodosActive}
              onClick={() => {
                store.router.routeTo('TODOS')
              }}
            /> */}

        <Link href="/~/page?id=today">
          <SidebarItem
            isActive={isJournalActive}
            icon={<CalendarDays size={18} />}
            label="Today"
          ></SidebarItem>
        </Link>

        <Link href="/~/posts">
          <SidebarItem
            isActive={pathname.startsWith('/~/posts')}
            icon={<Feather size={18} />}
            label="Posts"
          ></SidebarItem>
        </Link>

        <Link href="/~/assets">
          <SidebarItem
            isActive={pathname.startsWith('/~/assets')}
            icon={<ImageIcon size={18} />}
            label="Gallery"
          ></SidebarItem>
        </Link>

        <Link href="/~/pages">
          <SidebarItem
            isActive={pathname.startsWith('/~/pages')}
            icon={<FileText size={18} />}
            label="pages"
          ></SidebarItem>
        </Link>

        <Link href="/~/databases">
          <SidebarItem
            isActive={pathname.startsWith('/~/databases')}
            icon={<TableProperties size={18} />}
            label="Databases"
          ></SidebarItem>
        </Link>

        <Link href="/~/subscribers">
          <SidebarItem
            isActive={pathname.startsWith('/~/subscribers')}
            icon={<Users size={18} />}
            label="Subscribers"
          ></SidebarItem>
        </Link>

        <Link href="/~/settings">
          <SidebarItem
            isActive={pathname === '/~/settings'}
            icon={<Settings size={18} />}
            label="Settings"
          />
        </Link>

        {isSuperAdmin(data?.userId) && (
          <Link href="/~/coupons">
            <SidebarItem
              isActive={pathname === '/~/coupons'}
              icon={<Gift size={18} />}
              label="Coupons"
            />
          </Link>
        )}

        {!spaceId && <EnableWeb3Entry />}
        <LinkGoogleEntry />
        <LinkWalletEntry />
      </div>
    </div>
  )
}
