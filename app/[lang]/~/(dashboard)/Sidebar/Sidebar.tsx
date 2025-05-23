'use client'

import { useMemo } from 'react'
import { CreatePostButton } from '@/components/CreatePostButton'
import { ModeToggle } from '@/components/ModeToggle'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link, usePathname } from '@/lib/i18n'
import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { useSession } from '@/lib/useSession'
import { cn, isValidUUIDv4 } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import {
  BookTextIcon,
  Calendar,
  CalendarDays,
  Feather,
  FileText,
  Gift,
  ImageIcon,
  MicroscopeIcon,
  Settings,
  TableProperties,
  Users,
  Zap,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { EnableWeb3Entry } from './EnableWeb3Entry'
import { ImportPostEntry } from './ImportPostEntry'
import { LinkGoogleEntry } from './LinkGoogleEntry'
import { LinkWalletEntry } from './LinkWalletEntry'
import { QuickSearchTrigger } from './QuickSearchTrigger'
import { SidebarItem } from './SidebarItem'
import { SitesPopover } from './SitesPopover/SitesPopover'
import { UpgradeButton } from './UpgradeButton'
import { VisitSiteButton } from './VisitSiteButton'

const LinkAccountEntry = dynamic(() => import('./LinkAccountEntry'), {
  ssr: false,
})

interface Features {
  journal: boolean
  gallery: boolean
  page: boolean
  database: boolean
}

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

  const isFeatureActive = (feature: keyof Features) => {
    if (!site) return false
    const { features } = (site.config || {}) as any as {
      features: Features
    }
    return features?.[feature] || false
  }

  return (
    <div
      className={cn(
        'flex-col flex-1 flex gap-3 h-screen border-r-sidebar',
        bordered && 'border-r',
      )}
    >
      <div className="pl-4 flex items-center h-16 gap-1">
        <SitesPopover />
        <ModeToggle />
      </div>

      {/* <QuickSearchTrigger /> */}
      {/* <div className="px-3">
        <CreatePostButton className="w-full" />
      </div> */}

      <div className="flex flex-col gap-1 px-2">
        {isFeatureActive('journal') && (
          <Link href="/~/page?id=today">
            <SidebarItem
              isActive={isJournalActive}
              icon={<CalendarDays size={18} />}
              label={<Trans>Today</Trans>}
            ></SidebarItem>
          </Link>
        )}

        <Link href="/~/posts">
          <SidebarItem
            isActive={pathname.startsWith('/~/posts')}
            icon={<Feather size={18} />}
            label={<Trans>Posts</Trans>}
          ></SidebarItem>
        </Link>

        {isFeatureActive('gallery') && (
          <Link href="/~/assets">
            <SidebarItem
              isActive={pathname.startsWith('/~/assets')}
              icon={<ImageIcon size={18} />}
              label={<Trans>Gallery</Trans>}
            ></SidebarItem>
          </Link>
        )}

        {isFeatureActive('page') && (
          <Link href="/~/pages">
            <SidebarItem
              isActive={pathname.startsWith('/~/pages')}
              icon={<FileText size={18} />}
              label={<Trans>Pages</Trans>}
            ></SidebarItem>
          </Link>
        )}

        {isFeatureActive('database') && (
          <Link href="/~/databases">
            <SidebarItem
              isActive={pathname.startsWith('/~/databases')}
              icon={<TableProperties size={18} />}
              label={<Trans>Databases</Trans>}
            ></SidebarItem>
          </Link>
        )}

        {/* <Link href="/~/series">
          <SidebarItem
            isActive={pathname.startsWith('/~/series')}
            icon={<BookTextIcon size={18} />}
            label={<Trans>Series</Trans>}
          ></SidebarItem>
        </Link> */}

        <Separator></Separator>

        <Link href="/~/subscribers">
          <SidebarItem
            isActive={pathname.startsWith('/~/subscribers')}
            icon={<Users size={18} />}
            label={<Trans>Subscribers</Trans>}
          ></SidebarItem>
        </Link>

        {/* <Link href="/~/partner-program">
          <SidebarItem
            isActive={pathname.startsWith('/~/partner-program')}
            icon={<Zap size={18} />}
            label={<Trans>Partner program</Trans>}
          ></SidebarItem>
        </Link> */}

        <Link href="/~/design">
          <SidebarItem
            isActive={pathname.startsWith('/~/design')}
            icon={<Zap size={18} />}
            label={<Trans>Design</Trans>}
          ></SidebarItem>
        </Link>

        <Link href="/~/settings">
          <SidebarItem
            isActive={pathname === '/~/settings'}
            icon={<Settings size={18} />}
            label={<Trans>Settings</Trans>}
          />
        </Link>

        {isSuperAdmin(data?.userId) && (
          <Link href="/~/coupons">
            <SidebarItem
              isActive={pathname === '/~/coupons'}
              icon={<Gift size={18} />}
              label={<Trans>Coupons</Trans>}
            />
          </Link>
        )}
        {isSuperAdmin(data?.userId) && (
          <Link href="/~/discover">
            <SidebarItem
              isActive={pathname === '/~/discover'}
              icon={<Gift size={18} />}
              label={<Trans>Discover</Trans>}
            />
          </Link>
        )}
      </div>

      <div className="px-2 pb-2 flex-1">
        {/* {!spaceId && <EnableWeb3Entry />} */}
        {/* <LinkAccountEntry /> */}
        <ImportPostEntry />
      </div>
      <div className="">
        <UpgradeButton />
        <div className="flex items-center justify-between gap-1 pl-4 mb-4 ">
          <VisitSiteButton />
        </div>
      </div>
    </div>
  )
}
