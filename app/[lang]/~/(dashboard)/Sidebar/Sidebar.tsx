'use client'

import { useMemo } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { cn, isValidUUIDv4 } from '@/lib/utils'
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
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { EnableWeb3Entry } from './EnableWeb3Entry'
import { LinkGoogleEntry } from './LinkGoogleEntry'
import { LinkWalletEntry } from './LinkWalletEntry'
import { QuickSearchTrigger } from './QuickSearchTrigger'
import { SidebarItem } from './SidebarItem'
import { SitesPopover } from './SitesPopover/SitesPopover'

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
      <div className="px-4 flex items-center h-16">
        <SitesPopover />
      </div>

      <QuickSearchTrigger />

      <div className="flex flex-col gap-1 px-2">
        {isFeatureActive('journal') && (
          <Link href="/~/page?id=today">
            <SidebarItem
              isActive={isJournalActive}
              icon={<CalendarDays size={18} />}
              label="Today"
            ></SidebarItem>
          </Link>
        )}

        <Link href="/~/posts">
          <SidebarItem
            isActive={pathname.startsWith('/~/posts')}
            icon={<Feather size={18} />}
            label="Posts"
          ></SidebarItem>
        </Link>

        {isFeatureActive('gallery') && (
          <Link href="/~/assets">
            <SidebarItem
              isActive={pathname.startsWith('/~/assets')}
              icon={<ImageIcon size={18} />}
              label="Gallery"
            ></SidebarItem>
          </Link>
        )}

        {isFeatureActive('page') && (
          <Link href="/~/pages">
            <SidebarItem
              isActive={pathname.startsWith('/~/pages')}
              icon={<FileText size={18} />}
              label="pages"
            ></SidebarItem>
          </Link>
        )}

        {isFeatureActive('database') && (
          <Link href="/~/databases">
            <SidebarItem
              isActive={pathname.startsWith('/~/databases')}
              icon={<TableProperties size={18} />}
              label="Databases"
            ></SidebarItem>
          </Link>
        )}

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
      </div>

      <div className="px-2 pb-2">
        {!spaceId && <EnableWeb3Entry />}
        <LinkAccountEntry />
      </div>
    </div>
  )
}
