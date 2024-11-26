import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { Badge } from '@/components/ui/badge'
import { useSite } from '@/hooks/useSite'
import { cn } from '@/lib/utils'
import { Calendar, Feather, Menu, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSidebarSheet } from './Sidebar/useSidebarSheet'

export const Navbar = () => {
  const pathname = usePathname()
  const { site } = useSite()
  const { spaceId } = site
  const { setIsOpen } = useSidebarSheet()

  return (
    <div
      className={cn(
        'flex items-center justify-between md:hidden h-11 border-b border-foreground/5 fixed top-0 w-full px-3 z-20 bg-background',
      )}
    >
      <Menu
        size={20}
        className="cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
    </div>
  )
}
