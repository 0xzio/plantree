import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
  className?: string
}

export const Header = ({ site, className }: Props) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between w-full py-4 h-16 z-40',
        className,
      )}
    >
      <MobileSidebarSheet site={site} />
      <Navigation site={site} />

      <div className="flex item-center gap-2">
        <div className="flex items-center">
          <Airdrop />
        </div>
        <Profile></Profile>
      </div>
    </header>
  )
}
